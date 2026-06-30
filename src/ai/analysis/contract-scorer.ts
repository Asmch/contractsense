import { IContractClause } from "@/database/models/ContractClause";

export interface ContractScoreResult {
  safetyScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  lowRiskClauses: number;
  mediumRiskClauses: number;
  highRiskClauses: number;
  criticalRiskClauses: number;
  riskEngine: {
    overallRisk: number;
    legalRisk: number;
    financialRisk: number;
    operationalRisk: number;
    complianceRisk: number;
    privacyRisk: number;
    employmentRisk: number;
    intellectualPropertyRisk: number;
  };
  scoreExplanation: Array<{
    reason: string;
    impact: number;
    type: "BONUS" | "PENALTY";
  }>;
}

const CLAUSE_IMPORTANCE_WEIGHTS: Record<string, number> = {
  "Liability": 10,
  "Indemnification": 10,
  "Intellectual Property": 10,
  "Termination": 10,
  "Payment Terms": 8,
  "Confidentiality": 8,
  "Data Privacy": 8,
  "Non-Compete": 6,
  "Non-Solicitation": 6,
  "Employment": 5,
  "Warranty": 5,
  "Governing Law": 4,
  "Dispute Resolution": 4,
  "Force Majeure": 3,
  "Miscellaneous": 2,
  "Other": 2
};

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
        criticalRiskClauses: 0,
        riskEngine: {
          overallRisk: 0,
          legalRisk: 0,
          financialRisk: 0,
          operationalRisk: 0,
          complianceRisk: 0,
          privacyRisk: 0,
          employmentRisk: 0,
          intellectualPropertyRisk: 0
        },
        scoreExplanation: []
      };
    }

    let lowRiskClauses = 0;
    let mediumRiskClauses = 0;
    let highRiskClauses = 0;
    let criticalRiskClauses = 0;

    let totalWeight = 0;
    let weightedRiskSum = 0;
    const scoreExplanation: ContractScoreResult["scoreExplanation"] = [];

    clauses.forEach(clause => {
      const score = clause.riskScore || 0;
      const weight = CLAUSE_IMPORTANCE_WEIGHTS[clause.clauseType] || 2;
      
      weightedRiskSum += (score * weight);
      totalWeight += weight;

      if (clause.riskLevel === "CRITICAL") {
        criticalRiskClauses++;
        scoreExplanation.push({
          reason: `Critical risk in ${clause.clauseType}`,
          impact: -Math.round((score * weight) / 100),
          type: "PENALTY"
        });
      }
      else if (clause.riskLevel === "HIGH") {
        highRiskClauses++;
      }
      else if (clause.riskLevel === "MEDIUM") {
        mediumRiskClauses++;
      }
      else {
        lowRiskClauses++;
        if (weight >= 8) {
          scoreExplanation.push({
            reason: `Balanced/Favorable ${clause.clauseType}`,
            impact: 2,
            type: "BONUS"
          });
        }
      }
    });

    const averageRisk = totalWeight > 0 ? (weightedRiskSum / totalWeight) : 0;
    
    // Base safety score is inverse of weighted average risk
    let safetyScore = 100 - averageRisk;

    // Apply structured bonuses (from the generated explanations)
    let bonusPoints = scoreExplanation.filter(e => e.type === "BONUS").reduce((sum, e) => sum + e.impact, 0);
    safetyScore += bonusPoints;

    // Clamp between 0 and 100
    safetyScore = Math.max(0, Math.min(100, Math.round(safetyScore)));

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (safetyScore <= 40 || criticalRiskClauses > 0) riskLevel = "CRITICAL";
    else if (safetyScore <= 60 || highRiskClauses > 1) riskLevel = "HIGH";
    else if (safetyScore <= 80) riskLevel = "MEDIUM";

    // Phase 6 Enterprise Granular Risk Engine
    const categorizeRisk = (types: string[]) => {
      const relevant = clauses.filter(c => types.includes(c.clauseType));
      if (relevant.length === 0) return 0;
      const sum = relevant.reduce((acc, c) => acc + (c.riskScore || 0), 0);
      return Math.min(100, Math.round(sum / relevant.length));
    };

    const financialRisk = categorizeRisk(["Payment Terms", "Liability", "Indemnification"]);
    const privacyRisk = categorizeRisk(["Data Privacy", "Confidentiality"]);
    const ipRisk = categorizeRisk(["Intellectual Property"]);
    const employmentRisk = categorizeRisk(["Employment", "Non-Compete", "Non-Solicitation"]);
    const legalRisk = categorizeRisk(["Governing Law", "Dispute Resolution", "Warranty", "Termination"]);
    const operationalRisk = categorizeRisk(["Miscellaneous", "Force Majeure", "Other"]);
    
    let complianceRisk = 0;
    // Note: We use any here since complianceIssues was added later and might not be fully typed in all phases
    const complianceClauses = clauses.filter(c => (c as any).complianceIssues && (c as any).complianceIssues.length > 0);
    if (complianceClauses.length > 0) {
      complianceRisk = Math.min(100, Math.round(complianceClauses.reduce((acc, c) => acc + (c.riskScore || 0), 0) / complianceClauses.length + 20));
    }

    return {
      safetyScore,
      riskLevel,
      lowRiskClauses,
      mediumRiskClauses,
      highRiskClauses,
      criticalRiskClauses,
      riskEngine: {
        overallRisk: 100 - safetyScore,
        legalRisk,
        financialRisk,
        operationalRisk,
        complianceRisk,
        privacyRisk,
        employmentRisk,
        intellectualPropertyRisk: ipRisk
      },
      scoreExplanation
    };
  }
}
