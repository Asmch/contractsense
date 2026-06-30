import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/database/connection";
import { ComparisonModel } from "@/database/models/Comparison";
import { ComparisonClauseModel } from "@/database/models/ComparisonClause";
import { ContractVersionModel } from "@/database/models/ContractVersion";
import { ContractClauseModel } from "@/database/models/ContractClause";
import { ClauseMatcher } from "@/features/comparisons/services/clause-matcher";
import { DifferenceAnalyzer } from "@/features/comparisons/services/difference-analyzer";
import { ComparisonSummaryService } from "@/features/comparisons/services/comparison-summary";
import mongoose from "mongoose";

// In a real app, this comes from auth
const MOCK_USER_ID = "661f7d3a0100000000000001"; // Placeholder until auth is hooked up in this route

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { originalVersionId, revisedVersionId } = await req.json();

    if (!originalVersionId || !revisedVersionId) {
      return NextResponse.json({ error: "Missing version IDs" }, { status: 400 });
    }

    const origVersion = await ContractVersionModel.findById(originalVersionId);
    const revVersion = await ContractVersionModel.findById(revisedVersionId);

    if (!origVersion || !revVersion) {
      return NextResponse.json({ error: "Versions not found" }, { status: 404 });
    }

    // 1. Fetch Clauses
    // Note: If versionId is empty (legacy), fallback to contractId for the original version to support existing data
    const origClausesQuery = origVersion.versionNumber === 1 
      ? { $or: [{ versionId: originalVersionId }, { contractId: origVersion.contractId, versionId: { $exists: false } }] }
      : { versionId: originalVersionId };

    const originalClauses = await ContractClauseModel.find(origClausesQuery).lean();
    const revisedClauses = await ContractClauseModel.find({ versionId: revisedVersionId }).lean();

    // Create Comparison Document
    const comparisonId = new mongoose.Types.ObjectId();

    // 2. Match Clauses
    const matches = await ClauseMatcher.matchClauses(originalClauses as any, revisedClauses as any);

    // 3. Analyze Differences
    const { clauses, overallRiskDelta, overallChange } = DifferenceAnalyzer.analyzeDifferences(comparisonId, matches);

    // Save Comparison Clauses (without AI explanations yet)
    await ComparisonClauseModel.insertMany(clauses);

    // 4. Generate AI Summary & Impact Analysis
    const aiSummary = await ComparisonSummaryService.generateSummary(clauses, originalClauses as any, revisedClauses as any);

    // 5. Update Comparison Clauses with AI Explanations
    for (const aiClause of aiSummary.clauseAnalysis) {
      if (aiClause.revisedClauseId) {
        await ComparisonClauseModel.updateOne(
          { comparisonId, revisedClauseId: aiClause.revisedClauseId },
          { 
            $set: { 
              changeSeverity: aiClause.changeSeverity,
              businessImpact: aiClause.businessImpact,
              legalImpact: aiClause.legalImpact,
              aiDifferenceExplanation: aiClause.aiDifferenceExplanation
            } 
          }
        );
      } else if (aiClause.originalClauseId) {
        // Handle REMOVED clauses
        await ComparisonClauseModel.updateOne(
          { comparisonId, originalClauseId: aiClause.originalClauseId, status: "REMOVED" },
          { 
            $set: { 
              changeSeverity: aiClause.changeSeverity,
              businessImpact: aiClause.businessImpact,
              legalImpact: aiClause.legalImpact,
              aiDifferenceExplanation: aiClause.aiDifferenceExplanation
            } 
          }
        );
      }
    }

    // 6. Save Comparison Header
    const comparison = new ComparisonModel({
      _id: comparisonId,
      originalVersionId,
      revisedVersionId,
      contractId: origVersion.contractId,
      ownerId: origVersion.contractId, // Or actual auth user
      overallRiskDelta,
      overallChange,
      executiveSummary: aiSummary.executiveSummary,
      keyLegalChanges: aiSummary.keyLegalChanges,
      reviewRecommendations: aiSummary.reviewRecommendations
    });

    await comparison.save();

    return NextResponse.json({ id: comparison._id });

  } catch (error: any) {
    console.error("Comparison Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // In production, filter by user ownerId
    const comparisons = await ComparisonModel.find()
      .sort({ createdAt: -1 })
      .populate({ path: "originalVersionId", select: "versionNumber fileUrl createdAt" })
      .populate({ path: "revisedVersionId", select: "versionNumber fileUrl createdAt" })
      .populate({ path: "contractId", select: "title" })
      .lean();

    return NextResponse.json(comparisons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
