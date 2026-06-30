export interface DecisionResult {
  verdict: {
    title: string;
    subtitle: string;
    color: string;
    dotColor: string;
  };
  overallTakeaway: string;
  whatsGood: string[];
  needsAttentionDetailed: { title: string; impact: string }[];
  whatYouShouldDoList: string[];
  
  // Legacy fields (kept for backward compatibility with other components)
  healthScore: number;
  goodNews: string[];
  needsAttention: string[];
  whatYouShouldDo: string;
  reviewTime: string;
  aiConfidence: string;
  thirtySecondSummary: string;
  clauseBreakdown: {
    looksGood: number;
    needsAttention: number;
  };
  howToImprove: { action: string; outcome: string }[];
  potentialHealthScore: number;
  mathBreakdown: { label: string; points: number }[];
}

export function getContractDecision(contract: any, clauses: any[]): DecisionResult {
  const safetyScore = contract.safetyScore || 0;
  const criticalCount = clauses.filter(c => c.riskLevel === "CRITICAL").length;
  const highCount = clauses.filter(c => c.riskLevel === "HIGH").length;
  const mediumCount = clauses.filter(c => c.riskLevel === "MEDIUM").length;
  
  const needsAttentionCount = criticalCount + highCount;
  const looksGoodCount = clauses.length - needsAttentionCount;

  // 1. Calculate Verdict
  let verdict = { title: "Ready to Sign", subtitle: "Looks balanced and standard.", color: "bg-emerald-50 border-emerald-100", dotColor: "bg-emerald-500" };
  let overallTakeaway = "🟢 Overall: This agreement looks balanced and fair. You can safely sign this.";

  if (safetyScore < 75 || needsAttentionCount > 0) {
    verdict = { 
      title: "Sign After a Few Changes", 
      subtitle: `We've found a few important clauses that deserve your attention before signing. We'll explain each one in simple language and show you what you can ask to change.`,
      color: "bg-yellow-50 border-yellow-100",
      dotColor: "bg-yellow-400"
    };
    overallTakeaway = `🟡 Recommended next step: Review these ${needsAttentionCount} important clauses first.`;
  }

  // 2. What's Good (2-4 things)
  const whatsGood: string[] = [];
  const lowRiskClauses = clauses.filter(c => c.riskLevel === "LOW");
  
  if (lowRiskClauses.length > 0) {
    const safeTypes = lowRiskClauses.map(c => c.clauseType).filter(Boolean);
    if (safeTypes.includes("Payment Terms")) whatsGood.push("Payment terms are clearly defined.");
    if (safeTypes.includes("Confidentiality")) whatsGood.push("Confidentiality protections are included.");
    if (safeTypes.includes("Intellectual Property")) whatsGood.push("Intellectual property ownership is clearly explained.");
    if (safeTypes.includes("Termination")) whatsGood.push("The conditions for ending the contract are fair.");
    
    if (whatsGood.length === 0) {
      if (lowRiskClauses.length > clauses.length / 2) whatsGood.push("Most of the agreement follows standard practices.");
      whatsGood.push("The core structure of the agreement is sound and balanced.");
    }
  } else {
    whatsGood.push("The contract includes all the standard structural elements.");
  }

  // Ensure 2-4 items
  const finalWhatsGood = whatsGood.slice(0, 3);
  if (finalWhatsGood.length < 2) finalWhatsGood.push("The core structure of the agreement is sound.");

  // 3. Needs Attention Detailed (Human Readable Reasons)
  const highRiskClauses = [...clauses].sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0)).slice(0, 3);
  
  const issueMap: Record<string, string> = {
    "Liability": "The contract places high financial responsibility on you if something goes wrong.",
    "Indemnification": "You could be responsible for unexpected third-party losses or lawsuits.",
    "Termination": "The company can end the agreement with very little notice.",
    "Payment Terms": "Your payment timelines and conditions are unclear.",
    "Intellectual Property": "You are giving away more ownership of your work than standard.",
    "Non-Compete": "The agreement restricts your future work significantly.",
    "Confidentiality": "The confidentiality terms are unusually strict."
  };

  const needsAttentionDetailed = highRiskClauses.map(c => {
    const type = c.clauseType || "Other";
    let impact = issueMap[type] || `The ${c.title?.toLowerCase() || 'specific'} clause favors the other party.`;
    return {
      title: type !== "Other" ? type : (c.title || "Unknown Clause"),
      impact: impact
    };
  });

  // 4. What You Should Do (Actionable List)
  const whatYouShouldDoList: string[] = [];
  const recommendationMap: Record<string, string> = {
    "Liability": "Ask for a reasonable limit on your financial responsibility.",
    "Indemnification": "Limit your responsibility only to things directly under your control.",
    "Termination": "Request a longer, more fair notice period before termination.",
    "Payment Terms": "Clarify exactly when payments must be made and any late fees.",
    "Intellectual Property": "Ensure you retain ownership of your pre-existing tools or knowledge.",
    "Non-Compete": "Ask them to reduce the time or geographical scope of the restriction.",
    "Confidentiality": "Ensure the confidentiality period has a reasonable expiration date."
  };

  highRiskClauses.forEach(c => {
    const type = c.clauseType || "Other";
    if (recommendationMap[type]) {
      whatYouShouldDoList.push(recommendationMap[type]);
    } else {
      whatYouShouldDoList.push(`Request a revision of the ${c.title?.toLowerCase() || 'flagged'} clause to make it more balanced.`);
    }
  });

  if (whatYouShouldDoList.length === 0) {
    whatYouShouldDoList.push("You can safely sign this after a quick read-through.");
    whatYouShouldDoList.push("Keep a copy of the signed agreement for your records.");
  }

  // Support legacy fields
  const goodNews = finalWhatsGood;
  const needsAttention = needsAttentionDetailed.map(n => n.impact);
  const whatYouShouldDo = whatYouShouldDoList[0];
  const reviewTime = `About ${Math.max(5, Math.ceil(clauses.length * 1.5))} mins`;
  const avgConfidence = clauses.reduce((acc, curr) => acc + (curr.confidenceScore || 90), 0) / (clauses.length || 1);
  const aiConfidence = avgConfidence >= 85 ? "High" : avgConfidence >= 60 ? "Medium" : "Low";
  let thirtySecondSummary = criticalCount > 0 || highCount > 0 ? `Negotiate the flagged clauses first. Everything else looks standard.` : "Everything looks standard and safe to sign.";

  const howToImprove = highRiskClauses.map(c => ({
    action: `Negotiate ${c.clauseType?.toLowerCase() || 'this clause'}`,
    outcome: c.negotiationAdvice || "This could significantly improve the fairness of your agreement."
  }));

  let mathBreakdown: { label: string; points: number }[] = [];
  let potentialGain = 0;
  clauses.forEach(c => {
    if (c.riskScore && c.riskScore > 0) {
      mathBreakdown.push({ label: c.title || c.clauseType || "Clause", points: -c.riskScore });
      potentialGain += (c.riskReductionScore || Math.floor(c.riskScore * 0.8));
    }
  });
  mathBreakdown.sort((a, b) => a.points - b.points);
  const potentialHealthScore = Math.min(100, safetyScore + potentialGain);

  return {
    verdict,
    overallTakeaway,
    whatsGood: finalWhatsGood,
    needsAttentionDetailed,
    whatYouShouldDoList,
    healthScore: safetyScore,
    goodNews,
    needsAttention,
    whatYouShouldDo,
    reviewTime,
    aiConfidence,
    thirtySecondSummary,
    clauseBreakdown: {
      looksGood: looksGoodCount,
      needsAttention: needsAttentionCount
    },
    howToImprove,
    potentialHealthScore,
    mathBreakdown
  };
}
