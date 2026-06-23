import { IContractClause } from "@/database/models/ContractClause";

export interface ContractScoreResult {
  safetyScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  lowRiskClauses: number;
  mediumRiskClauses: number;
  highRiskClauses: number;
  criticalRiskClauses: number;
}

export class ContractScorer {
  /**
   * Deterministically calculates the overall contract safety score.
   * Safety Score is 100 (Perfectly Safe) to 0 (Extremely Dangerous).
   */
  static calculateScore(clauses: IContractClause[]): ContractScoreResult {
    if (!clauses || clauses.length === 0) {
      return {
        safetyScore: 100,
        riskLevel: "LOW",
        lowRiskClauses: 0,
        mediumRiskClauses: 0,
        highRiskClauses: 0,
        criticalRiskClauses: 0
      };
    }

    let totalRiskScore = 0;
    let lowRiskClauses = 0;
    let mediumRiskClauses = 0;
    let highRiskClauses = 0;
    let criticalRiskClauses = 0;

    clauses.forEach(clause => {
      const score = clause.riskScore || 0;
      totalRiskScore += score;

      if (clause.riskLevel === "CRITICAL") criticalRiskClauses++;
      else if (clause.riskLevel === "HIGH") highRiskClauses++;
      else if (clause.riskLevel === "MEDIUM") mediumRiskClauses++;
      else lowRiskClauses++;
    });

    const averageRisk = totalRiskScore / clauses.length;
    
    // Base safety score is inverse of average risk
    let safetyScore = 100 - averageRisk;

    // Apply weighted penalties for high/critical risks
    // Even one critical risk severely impacts the contract's safety
    safetyScore -= (criticalRiskClauses * 15);
    safetyScore -= (highRiskClauses * 5);

    // Clamp between 0 and 100
    safetyScore = Math.max(0, Math.min(100, Math.round(safetyScore)));

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (safetyScore <= 40 || criticalRiskClauses > 0) riskLevel = "CRITICAL";
    else if (safetyScore <= 60 || highRiskClauses > 1) riskLevel = "HIGH";
    else if (safetyScore <= 80) riskLevel = "MEDIUM";

    return {
      safetyScore,
      riskLevel,
      lowRiskClauses,
      mediumRiskClauses,
      highRiskClauses,
      criticalRiskClauses
    };
  }
}
