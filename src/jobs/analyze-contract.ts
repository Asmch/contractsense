import { ContractModel } from "@/database/models/Contract";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { ClauseAnalyzer } from "../ai/analysis/clause-analyzer";
import { ContractScorer } from "../ai/analysis/contract-scorer";
import { SummaryGenerator } from "../ai/analysis/summary-generator";
import { Negotiator } from "../ai/negotiation/negotiator";
import { connectToDatabase } from "@/database/connection";

export class AnalyzeContractJob {
  static async run(contractId: string) {
    await connectToDatabase();
    
    const contract = await ContractModel.findById(contractId);
    if (!contract) throw new Error("Contract not found");

    const log = (stage: string, message: string) => {
      contract.processingLogs.push({ stage, message, timestamp: new Date() });
    };

    try {
      contract.status = "ANALYZING";
      log("AI_ANALYSIS", "Starting AI risk analysis pipeline");
      await contract.save();

      const clauses = await ContractClauseModel.find({ contractId }).sort({ order: 1 });
      if (!clauses || clauses.length === 0) {
        throw new Error("No clauses found to analyze");
      }

      let totalTokens = 0;

      // 1. Analyze Clauses in Batches to avoid rate limits
      // Only process clauses that haven't been successfully analyzed yet (Idempotency)
      const meaningfulClauses = clauses.filter(c => c.content.length > 50 && !c.rawAiResponse);
      
      if (meaningfulClauses.length > 0) {
        log("AI_ANALYSIS", `Analyzing ${meaningfulClauses.length} unanalyzed clauses using Gemini 2.5 Flash in batches...`);
        
        const BATCH_SIZE = 50; // Increased to 50 to drastically reduce the number of API calls per contract
        for (let i = 0; i < meaningfulClauses.length; i += BATCH_SIZE) {
          const batch = meaningfulClauses.slice(i, i + BATCH_SIZE);
          
          const clausesPayload = batch.map(c => ({
            id: c._id.toString(),
            title: c.title,
            content: c.content
          }));

          const { results, tokensUsed } = await ClauseAnalyzer.analyzeClausesBatch(clausesPayload);
          totalTokens += tokensUsed;

          // Map results back to the original clauses and save
          for (const res of results) {
            const clause = batch.find(c => c._id.toString() === res.clauseId);
            if (clause) {
              if (res.analysis.cleanTitle) {
                clause.title = res.analysis.cleanTitle;
              }
              clause.clauseType = res.analysis.clauseType as any;
              if (res.analysis.confidenceScore !== undefined) {
                clause.confidenceScore = res.analysis.confidenceScore;
              }
              clause.riskLevel = res.analysis.riskLevel;
              clause.riskScore = res.analysis.riskScore;
              clause.explanation = res.analysis.explanation;
              clause.concerns = res.analysis.concerns;
              clause.recommendations = res.analysis.recommendations;
              clause.rawAiResponse = JSON.stringify(res.analysis);
              await clause.save();
            }
          }
        }
      }

      contract.analysisProgress = {
        clausesAnalyzed: true,
        scoringComplete: false,
        summaryGenerated: false,
        negotiationAnalyzed: false
      };
      await contract.save();

      // 2. Score the Contract Deterministically
      if (!contract.analysisProgress.scoringComplete) {
        log("AI_ANALYSIS", "Calculating deterministic safety score...");
        const updatedClauses = await ContractClauseModel.find({ contractId });
        const scoreResult = ContractScorer.calculateScore(updatedClauses);
        
        contract.safetyScore = scoreResult.safetyScore;
        contract.riskLevel = scoreResult.riskLevel;
        contract.analysisProgress.scoringComplete = true;
        await contract.save();
      }

      // 3. Generate Executive Summary
      if (!contract.analysisProgress.summaryGenerated) {
        log("AI_ANALYSIS", "Generating executive summary...");
        const updatedClauses = await ContractClauseModel.find({ contractId });
        const { result: summaryResult, tokensUsed: summaryTokens } = await SummaryGenerator.generateSummary(updatedClauses);
        totalTokens += summaryTokens;

        contract.executiveSummary = summaryResult.executiveSummary;
        contract.keyTakeaways = summaryResult.keyTakeaways;
        contract.analysisProgress.summaryGenerated = true;
      }

      // 4. Run Negotiation AI on eligible clauses
      if (!contract.analysisProgress.negotiationAnalyzed) {
        log("AI_ANALYSIS", "Running Negotiation Copilot on high-risk clauses...");
        const updatedClauses = await ContractClauseModel.find({ contractId });
        
        let negotiatedCount = 0;
        for (const clause of updatedClauses) {
          if (Negotiator.shouldNegotiate(clause as any) && !clause.suggestedRewrite) {
            log("AI_ANALYSIS", `Generating negotiation strategy for clause: ${clause.title}`);
            // Use try-catch so one failed clause doesn't crash the whole job
            try {
              const { tokensUsed } = await Negotiator.analyzeClause(clause as any);
              totalTokens += tokensUsed;
              await clause.save();
              negotiatedCount++;
            } catch (err) {
              console.error(`Failed to negotiate clause ${clause.title}:`, err);
            }
          }
        }
        
        log("AI_ANALYSIS", `Generated negotiation strategies for ${negotiatedCount} clauses.`);
        contract.analysisProgress.negotiationAnalyzed = true;

        // 5. Generate Executive Negotiation Report
        const negotiatedClauses = await ContractClauseModel.find({ 
          contractId, 
          suggestedRewrite: { $exists: true, $ne: null } 
        }).sort({ riskScore: -1 });

        const topNegotiations = negotiatedClauses.map(c => c.title);
        const ignoredClauses = updatedClauses
          .filter(c => !Negotiator.shouldNegotiate(c as any))
          .map(c => c.title)
          .slice(0, 3); // Max 3 for brevity

        contract.executiveNegotiationReport = {
          whatToNegotiateFirst: topNegotiations.slice(0, 1),
          whatToNegotiateSecond: topNegotiations.slice(1, 3),
          whatCanBeIgnored: ignoredClauses
        };
      }

      // Finalize Tracking & Status
      contract.aiUsage = {
        provider: "Google",
        model: "gemini-2.5-flash",
        tokensUsed: (contract.aiUsage?.tokensUsed || 0) + totalTokens,
        estimatedCost: ((contract.aiUsage?.tokensUsed || 0) + totalTokens) * (0.000000075)
      };
      contract.analysisVersion = "v1";
      contract.analyzedAt = new Date();
      contract.status = "COMPLETE";

      log("COMPLETE", `AI Analysis finished. Safety Score: ${contract.safetyScore}/100`);
      await contract.save();

    } catch (error: any) {
      console.error("Analysis Job Error:", error);
      
      if (error.message?.startsWith("RATE_LIMIT_EXCEEDED")) {
        const waitTime = error.message.split(":")[1] || "60";
        contract.status = "RATE_LIMITED";
        log("RATE_LIMITED", `API Rate Limit hit. Pausing process. Resume in ${waitTime} seconds.`);
      } else {
        contract.status = "FAILED";
        log("FAILED", `AI Analysis failed: ${error.message}`);
      }
      
      await contract.save();
      throw error;
    }
  }
}
