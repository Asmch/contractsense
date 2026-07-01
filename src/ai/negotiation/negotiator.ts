import { IContractClause } from "@/database/models/ContractClause";
import { RewriteGenerator } from "./rewrite-generator";
import { StrategyGenerator } from "./strategy-generator";
import { NegotiationScorer } from "./negotiation-scorer";

export class Negotiator {
  static readonly NEGOTIABLE_CLAUSE_TYPES = [
    "Liability",
    "Indemnification",
    "Payment Terms",
    "Termination",
    "Intellectual Property"
  ];

  static shouldNegotiate(clause: IContractClause): boolean {
    const isHighRisk = (clause.riskScore || 0) > 60;
    const isNegotiableType = this.NEGOTIABLE_CLAUSE_TYPES.includes(clause.clauseType);
    
    return isHighRisk || isNegotiableType;
  }

  static async analyzeClause(clause: IContractClause): Promise<{ tokensUsed: number }> {
    if (!this.shouldNegotiate(clause)) {
      return { tokensUsed: 0 };
    }

    let totalTokens = 0;

    // 1. Generate Rewrite
    const rewriteResponse = await RewriteGenerator.generateRewrite(
      clause.content,
      clause.explanation || "Unknown risk"
    );
    totalTokens += rewriteResponse.tokensUsed;

    clause.suggestedRewrite = rewriteResponse.result.suggestedRewrite;
    clause.acceptanceProbability = rewriteResponse.result.acceptanceProbability;
    clause.negotiationConfidence = rewriteResponse.result.negotiationConfidence;

    // 2. Generate Strategy
    const strategyResponse = await StrategyGenerator.generateStrategy(
      clause.clauseType,
      clause.content,
      clause.explanation || "Unknown risk"
    );
    totalTokens += strategyResponse.tokensUsed;

    clause.talkingPoints = strategyResponse.result.talkingPoints;
    clause.idealPosition = strategyResponse.result.idealPosition;
    clause.fallbackPosition = strategyResponse.result.fallbackPosition;
    clause.marketStandard = strategyResponse.result.marketStandard;
    clause.marketStandardReason = strategyResponse.result.marketStandardReason;

    // 3. Score Risk Reduction
    clause.riskReductionScore = NegotiationScorer.calculateRiskReduction(
      clause.riskScore || 0,
      clause.clauseType
    );

    // 4. Set priority based on original risk and type
    if ((clause.riskScore || 0) >= 80) clause.negotiationPriority = "Must Fix";
    else if ((clause.riskScore || 0) >= 60) clause.negotiationPriority = "Recommended";
    else if ((clause.riskScore || 0) >= 40) clause.negotiationPriority = "Optional";
    else clause.negotiationPriority = "None";

    if (clause.riskScore && clause.riskScore > 60) {
       clause.negotiationAdvice = "Negotiation is highly recommended due to high risk.";
    } else {
       clause.negotiationAdvice = "Negotiation is recommended to improve position, though risk is moderate.";
    }

    return { tokensUsed: totalTokens };
  }
}
