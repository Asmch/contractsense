const EMERGENCY_FALLBACK = "AI analysis unavailable. Please regenerate analysis.";

export function getInOneSentence(clause: any): string {
  return clause?.clauseInsight?.plainExplanation || EMERGENCY_FALLBACK;
}

export function getWhyThisMatters(clause: any): string {
  return clause?.clauseInsight?.whyItMatters || EMERGENCY_FALLBACK;
}

export function getRealLifeExample(clause: any): string {
  return clause?.clauseInsight?.realLifeExample || "";
}

export function getShouldYouBeConcernedText(clause: any): { text: string; color: string; indicator: string } {
  const worry = clause?.clauseInsight?.shouldYouWorry;
  if (worry === "Don't Ignore") return { indicator: "🔴", text: "Yes. Don't ignore this one.", color: "text-red-600 bg-red-50" };
  if (worry === "Worth Discussing") return { indicator: "🟡", text: "Worth discussing.", color: "text-orange-600 bg-orange-50" };
  if (worry === "Not Really") return { indicator: "🟢", text: "Not really. This clause is fairly standard.", color: "text-emerald-600 bg-emerald-50" };
  
  return { indicator: "⚠️", text: EMERGENCY_FALLBACK, color: "text-slate-600 bg-slate-50" };
}

export function getCanYouIgnoreThis(clause: any): { text: string; description: string; ignore: boolean } {
  const canIgnore = clause?.clauseInsight?.canIgnore;
  if (canIgnore === true) return { text: "✅ Yes", description: "No action needed.", ignore: true };
  if (canIgnore === false) return { text: "❌ No", description: "You should not ignore this.", ignore: false };
  
  return { text: "⚠️", description: EMERGENCY_FALLBACK, ignore: false };
}

export function getAIConfidence(clause: any): { text: string; description: string; color: string } {
  const level = clause?.confidenceLevel;
  const reason = clause?.clauseInsight?.confidenceReason || EMERGENCY_FALLBACK;
  
  if (level === "High" || clause?.confidenceScore >= 85) {
    return { text: "High Confidence", description: reason, color: "text-emerald-600 bg-emerald-50" };
  }
  
  if (level === "Medium" || clause?.confidenceScore >= 60) {
    return { text: "Medium Confidence", description: reason, color: "text-amber-600 bg-amber-50" };
  }
  
  return { text: "Low Confidence", description: reason, color: "text-red-600 bg-red-50" };
}

export function getBottomLine(clause: any): string {
  return clause?.clauseInsight?.recommendedAction || EMERGENCY_FALLBACK;
}

export function getCommonInContracts(clause: any): string {
  return clause?.clauseInsight?.howCommonIsThis || EMERGENCY_FALLBACK;
}

