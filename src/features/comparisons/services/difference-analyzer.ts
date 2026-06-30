import { MatchedClausePair } from "./clause-matcher";
import { IComparisonClause } from "@/database/models/ComparisonClause";
import mongoose from "mongoose";

export interface AnalyzedDifference {
  comparisonClauseDoc: Partial<IComparisonClause>;
}

export class DifferenceAnalyzer {
  
  static analyzeDifferences(
    comparisonId: mongoose.Types.ObjectId,
    matches: MatchedClausePair[]
  ): { 
    clauses: Partial<IComparisonClause>[]; 
    overallRiskDelta: number;
    overallChange: "RISK_INCREASED" | "RISK_REDUCED" | "NO_SIGNIFICANT_CHANGE";
  } {
    const clauses: Partial<IComparisonClause>[] = [];
    let overallRiskDelta = 0;

    for (const match of matches) {
      const origScore = match.originalClause?.riskScore || 0;
      const revScore = match.revisedClause?.riskScore || 0;
      
      let riskDelta = 0;

      if (match.status === "ADDED") {
        riskDelta = revScore;
      } else if (match.status === "REMOVED") {
        // Removing a risk is a negative risk delta (reduction)
        riskDelta = -origScore;
      } else {
        // MODIFIED or UNCHANGED
        riskDelta = revScore - origScore;
      }

      overallRiskDelta += riskDelta;

      clauses.push({
        comparisonId,
        originalClauseId: match.originalClause?._id as mongoose.Types.ObjectId,
        revisedClauseId: match.revisedClause?._id as mongoose.Types.ObjectId,
        status: match.status,
        matchConfidence: match.matchConfidence,
        riskDelta: riskDelta
      });
    }

    let overallChange: "RISK_INCREASED" | "RISK_REDUCED" | "NO_SIGNIFICANT_CHANGE" = "NO_SIGNIFICANT_CHANGE";
    if (overallRiskDelta > 5) {
      overallChange = "RISK_INCREASED";
    } else if (overallRiskDelta < -5) {
      overallChange = "RISK_REDUCED";
    }

    return {
      clauses,
      overallRiskDelta,
      overallChange
    };
  }
}
