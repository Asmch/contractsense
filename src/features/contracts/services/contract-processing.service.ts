import { ContractModel } from "@/database/models/Contract";
import { DocumentParserService } from "./document-parser.service";
import { ClauseDetectorService } from "./clause-detector.service";
import { ContractClauseRepository } from "../repositories/clause.repository";
import { ContractProcessingLogModel } from "@/database/models/ContractProcessingLog";
import { connectToDatabase } from "@/database/connection";

export class ContractProcessingService {
  /**
   * Orchestrates the entire non-AI pipeline: Download -> Extract -> Structure -> Save
   */
  static async processContract(contractId: string) {
    await connectToDatabase();

    // Atomically lock the contract to prevent double execution, allowing RATE_LIMITED to resume
    let contract = await ContractModel.findOneAndUpdate(
      {
        _id: contractId,
        status: { $in: ["UPLOADED", "FAILED", "RATE_LIMITED"] }
      },
      {
        $set: {
          // We don't blindly set PARSING because it might be resuming from RATE_LIMITED
          processingStartedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!contract) {
      const existing = await ContractModel.findById(contractId);
      if (!existing) throw new Error("Contract not found");

      if (["PARSING", "ANALYZING", "READY", "COMPLETE", "SEGMENTATION_REVIEW_REQUIRED"].includes(existing.status)) {
        console.log(`[Contract Processing] Contract ${contractId} is already in state ${existing.status}. Skipping duplicate execution.`);
        return;
      }
      throw new Error(`Cannot process contract in status: ${existing.status}`);
    }

    if (!contract.fileUrl) throw new Error("Contract missing fileUrl");

    const log = async (step: string, message: string, severity: "INFO" | "WARNING" | "ERROR" = "INFO") => {
      contract!.processingLogs.push({ stage: step, message, timestamp: new Date() });
      await ContractProcessingLogModel.create({
        contractId: contract!._id,
        step,
        message,
        severity
      });
    };

    try {
      // Only parse and detect clauses if we are starting fresh (not resuming from a rate limit)
      if (contract.status === "UPLOADED" || contract.status === "FAILED") {
        contract.status = "PARSING";
        await log("EXTRACTING_TEXT", "Starting text extraction from Cloudinary");
        await contract.save();

        // 1. Parse File
        const { text, pageCount, wordCount } = await DocumentParserService.parseFromUrl(contract.fileUrl, contract.title);

        contract.rawText = text;
        contract.pageCount = pageCount;
        contract.wordCount = wordCount;
        await log("EXTRACTING_TEXT", `Successfully extracted ${wordCount} words across ${pageCount} pages`);

        contract.status = "ANALYZING";
        await log("CLAUSE_DETECTION", "Starting clause detection heuristics");
        await contract.save();

        // 2. Detect Clauses
        const rawClauses = ClauseDetectorService.detectClauses(text, contractId);

        // 3. Save Clauses
        await ContractClauseRepository.deleteByContract(contractId); // Clean up any previous retries
        await ContractClauseRepository.createMany(rawClauses);

        await log("CLAUSE_DETECTION", `Successfully structured ${rawClauses.length} distinct clauses`);

        // VALIDATION GATE
        const meaningfulClauses = rawClauses.filter(c => c.content && c.content.length > 50);
        const avgConfidence = rawClauses.reduce((sum, c) => sum + (c.confidenceScore || 0), 0) / (rawClauses.length || 1);

        const isValidationPassed = meaningfulClauses.length >= 5 || avgConfidence >= 60;

        if (!isValidationPassed) {
          contract.status = "SEGMENTATION_REVIEW_REQUIRED";
          await log("VALIDATION", `Segmentation validation failed. Meaningful clauses: ${meaningfulClauses.length}, Avg Confidence: ${avgConfidence.toFixed(2)}`, "WARNING");
          await contract.save();
          return; // STOP EXECUTION HERE, DO NOT CALL AI
        }

        await log("VALIDATION", `Segmentation passed. Meaningful clauses: ${meaningfulClauses.length}, Avg Confidence: ${avgConfidence.toFixed(2)}`);
      }

      // 4. Trigger AI Analysis
      contract.status = "READY";
      await contract.save();

      // Run AI Job synchronously for now
      const { AnalyzeContractJob } = require("@/jobs/analyze-contract");
      await AnalyzeContractJob.run(contractId);

    } catch (error: any) {
      // Refetch to avoid VersionError if anything else touched it, just to be safe
      contract = await ContractModel.findById(contractId) || contract;

      // Don't overwrite RATE_LIMITED if the job just set it
      if (contract.status !== "RATE_LIMITED") {
        contract.status = "FAILED";
        await log("FAILED", error.message, "ERROR");
        await contract.save();
      }

      throw error;
    }
  }
}
