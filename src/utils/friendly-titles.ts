export function getFriendlyClauseTitle(originalTitle: string): string {
  if (!originalTitle) return originalTitle;
  
  const normalizedTitle = originalTitle.toLowerCase().trim();

  // Keyword-based matching for robust mapping
  if (normalizedTitle.includes("confidential")) {
    return "Keeping Information Private";
  }
  if (normalizedTitle.includes("termination") || normalizedTitle.includes("cancellation")) {
    return "How This Agreement Can End";
  }
  if (normalizedTitle.includes("liability") || normalizedTitle.includes("indemnity") || normalizedTitle.includes("indemnification")) {
    return "Who Pays If Something Goes Wrong";
  }
  if (normalizedTitle.includes("jurisdiction") || normalizedTitle.includes("governing law")) {
    return "Which Court Will Handle Problems";
  }
  if (normalizedTitle.includes("intellectual property") || normalizedTitle.includes("ip rights") || normalizedTitle.includes("ownership")) {
    return "Who Owns the Work";
  }
  if (normalizedTitle.includes("payment") || normalizedTitle.includes("compensation") || normalizedTitle.includes("fees")) {
    return "When You'll Get Paid";
  }
  if (normalizedTitle.includes("force majeure") || normalizedTitle.includes("act of god")) {
    return "What Happens During Unexpected Events";
  }
  if (normalizedTitle.includes("dispute") || normalizedTitle.includes("arbitration") || normalizedTitle.includes("mediation")) {
    return "How Disagreements Will Be Solved";
  }
  if (normalizedTitle.includes("warranty") || normalizedTitle.includes("warranties") || normalizedTitle.includes("guarantee")) {
    return "Promises Made About the Work";
  }
  if (normalizedTitle.includes("non-compete") || normalizedTitle.includes("non-solicitation") || normalizedTitle.includes("restrictive covenant")) {
    return "Restrictions on Your Future Work";
  }
  if (normalizedTitle.includes("assignment") || normalizedTitle.includes("subcontracting")) {
    return "Can You Transfer This Contract?";
  }
  if (normalizedTitle.includes("severability")) {
    return "What Happens If Part of This is Invalid";
  }
  if (normalizedTitle.includes("amendment") || normalizedTitle.includes("modification")) {
    return "How This Contract Can Be Changed";
  }
  if (normalizedTitle.includes("entire agreement") || normalizedTitle.includes("integration")) {
    return "Only This Document Counts";
  }
  if (normalizedTitle.includes("relationship") || normalizedTitle.includes("independent contractor")) {
    return "Your Working Relationship";
  }

  // Fallback to original if no mapping exists
  return originalTitle;
}
