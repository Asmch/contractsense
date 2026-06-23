export class NegotiationScorer {
  /**
   * Estimates the risk reduction score after applying the suggested rewrite.
   * Simple heuristic:
   * CRITICAL (100-80) -> Drops to 30-40
   * HIGH (79-60) -> Drops to 20-30
   * MEDIUM (59-40) -> Drops to 10-20
   */
  static calculateRiskReduction(originalRiskScore: number, clauseType: string): number {
    let targetRisk = 20; // Default acceptable risk

    if (originalRiskScore >= 80) {
      targetRisk = 35; // Critical risks are hard to eliminate completely
    } else if (originalRiskScore >= 60) {
      targetRisk = 25;
    } else if (originalRiskScore >= 40) {
      targetRisk = 15;
    }

    // Special cases based on clause type could be added here
    if (clauseType === "Liability" || clauseType === "Indemnification") {
      targetRisk += 5; // Inherently riskier
    }

    const reduction = originalRiskScore - targetRisk;
    return Math.max(0, reduction); // Ensure positive
  }
}
