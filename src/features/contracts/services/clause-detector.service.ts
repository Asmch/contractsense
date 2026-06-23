import { IContractClause } from "@/database/models/ContractClause";

const CLAUSE_CATEGORIES = [
  "Payment Terms", "Confidentiality", "Intellectual Property", "Liability", 
  "Indemnification", "Warranty", "Termination", "Governing Law", 
  "Dispute Resolution", "Force Majeure", "Employment", "Non-Compete", 
  "Non-Solicitation", "Data Privacy", "Miscellaneous", "Other"
];

const LEGAL_KEYWORDS = [
  "payment", "confidentiality", "non-disclosure", "intellectual property",
  "ownership", "liability", "indemnity", "indemnification", "warranty",
  "termination", "jurisdiction", "governing law", "arbitration",
  "dispute resolution", "force majeure", "non-compete", "non-solicitation",
  "assignment", "limitation of liability"
];

export class ClauseDetectorService {
  static detectClauses(text: string, contractId: string): Partial<IContractClause>[] {
    const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p);
    
    let rawClauses: Partial<IContractClause>[] = [];
    let currentClause: Partial<IContractClause> | null = null;
    let order = 0;
    let currentIndex = 0;

    for (const p of paragraphs) {
      const match = this.evaluateStrategies(p);
      
      if (match.isBoundary) {
        if (currentClause && currentClause.content!.trim().length > 0) {
          currentClause.sourceLocation!.end = currentIndex;
          rawClauses.push(currentClause);
        }
        
        let cleanTitle = p.replace(/^(\d+\.[\d\.]*\s+|[IVX]+\.\s+|ARTICLE\s+[IVX\d]+\s*[:\-]?\s*)/i, '').trim();
        if (!cleanTitle || cleanTitle.length > 100) cleanTitle = p.substring(0, 50) + "...";

        currentClause = {
          contractId: contractId as any,
          title: cleanTitle,
          content: p,
          clauseType: this.categorizeClause(cleanTitle),
          order: order++,
          confidenceScore: match.confidenceScore,
          boundaryConfidence: match.boundaryConfidence,
          detectedBy: match.detectedBy as any,
          detectionReason: match.detectionReason,
          sourceLocation: { start: currentIndex, end: currentIndex }
        };
      } else {
        if (!currentClause) {
          currentClause = {
            contractId: contractId as any,
            title: "Preamble & Recitals",
            content: p,
            clauseType: "Other",
            order: order++,
            confidenceScore: 90,
            boundaryConfidence: 100,
            detectedBy: "STRUCTURAL_ANALYSIS" as any,
            detectionReason: "Beginning of document",
            sourceLocation: { start: currentIndex, end: currentIndex }
          };
        } else {
          currentClause.content += `\n\n${p}`;
        }
      }
      currentIndex += p.length;
    }

    if (currentClause && currentClause.content!.trim().length > 0) {
      currentClause.sourceLocation!.end = currentIndex;
      rawClauses.push(currentClause);
    }

    // Post-processing: Merge Engine
    rawClauses = this.mergeSmallClauses(rawClauses);

    // Final fallback
    if (rawClauses.length === 0) {
      rawClauses.push({
         contractId: contractId as any,
         title: "General Document",
         content: text || "No text could be extracted from this document.",
         clauseType: "Other",
         order: 0,
         confidenceScore: 40,
         boundaryConfidence: 20,
         detectedBy: "STRUCTURAL_ANALYSIS" as any,
         detectionReason: "Fallback - no boundaries detected",
         sourceLocation: { start: 0, end: text.length }
      });
    }

    // Reorder after merging
    rawClauses.forEach((c, i) => c.order = i);

    return rawClauses;
  }

  private static evaluateStrategies(p: string): 
    | { isBoundary: true; priority: number; detectedBy: string; confidenceScore: number; boundaryConfidence: number; detectionReason: string }
    | { isBoundary: false; priority?: undefined; detectedBy?: undefined; confidenceScore?: undefined; boundaryConfidence?: undefined; detectionReason?: undefined } {
    const strategies = [];

    // Strategy B: Numbered Section (Priority 1)
    const numberedRegex = /^(\d+\.\d*\.?\s+)/;
    if (numberedRegex.test(p) && p.length < 200) {
      strategies.push({
        priority: 1,
        detectedBy: "NUMBERED_SECTION",
        confidenceScore: 95,
        boundaryConfidence: 98,
        detectionReason: `Detected numbered section pattern: ${p.match(numberedRegex)?.[1].trim()}`
      });
    }

    // Strategy C: Roman Numeral (Priority 2)
    const romanRegex = /^(ARTICLE\s+[IVX\d]+\.?|[IVX]+\.)\s+/i;
    if (romanRegex.test(p) && p.length < 200) {
      strategies.push({
        priority: 2,
        detectedBy: "ROMAN_NUMERAL",
        confidenceScore: 92,
        boundaryConfidence: 95,
        detectionReason: `Detected roman numeral/article pattern: ${p.match(romanRegex)?.[1].trim()}`
      });
    }

    // Strategy A: Header (Priority 3)
    const isAllCaps = /^[A-Z\s&,\.\-]+$/.test(p) && p.length > 3;
    const isTitleCase = /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/.test(p) && p.length > 5;
    if ((isAllCaps || isTitleCase) && p.length < 100) {
      strategies.push({
        priority: 3,
        detectedBy: "HEADER",
        confidenceScore: isAllCaps ? 88 : 80,
        boundaryConfidence: 85,
        detectionReason: `Detected standalone ${isAllCaps ? 'ALL CAPS' : 'Title Case'} header`
      });
    }

    // Strategy D: Keyword Heuristic (Priority 5)
    // Only check if it's relatively short (like a subtitle)
    if (p.length < 80) {
      const lowerP = p.toLowerCase();
      const matchedKeyword = LEGAL_KEYWORDS.find(k => lowerP.includes(k));
      if (matchedKeyword) {
        strategies.push({
          priority: 5,
          detectedBy: "KEYWORD_HEURISTIC",
          confidenceScore: 70,
          boundaryConfidence: 60,
          detectionReason: `Detected legal keyword: '${matchedKeyword}' in short paragraph`
        });
      }
    }

    // Sort by priority (lowest number = highest priority)
    strategies.sort((a, b) => a.priority - b.priority);

    if (strategies.length > 0) {
      return { isBoundary: true, ...strategies[0] };
    }

    return { isBoundary: false };
  }

  private static mergeSmallClauses(clauses: Partial<IContractClause>[]): Partial<IContractClause>[] {
    const merged: Partial<IContractClause>[] = [];
    
    for (let i = 0; i < clauses.length; i++) {
      const current = clauses[i];
      
      // If we have a previous clause and current is very small (< 100 chars), AND they share the same strategy/type (or current is a structural split of previous)
      if (merged.length > 0) {
        const prev = merged[merged.length - 1];
        
        const isSmall = current.content!.length < 100;
        const sameTopic = current.clauseType === prev.clauseType;
        const sameStrategy = current.detectedBy === prev.detectedBy;

        // If it's a small fragment that seems related, merge it back
        if (isSmall && sameTopic && sameStrategy) {
          prev.content += `\n\n${current.content}`;
          prev.sourceLocation!.end = current.sourceLocation!.end;
          // Upgrade confidence since we correctly merged a fragmented block
          prev.boundaryConfidence = Math.min(100, (prev.boundaryConfidence || 80) + 5);
          continue;
        }
      }
      
      merged.push(current);
    }

    return merged;
  }

  private static categorizeClause(title: string): IContractClause["clauseType"] {
    const t = title.toLowerCase();
    if (t.includes("payment") || t.includes("fee") || t.includes("compensation") || t.includes("invoice")) return "Payment Terms";
    if (t.includes("confidential") || t.includes("non-disclosure") || t.includes("nda")) return "Confidentiality";
    if (t.includes("intellectual property") || t.includes("ip ") || t.includes("ownership") || t.includes("license")) return "Intellectual Property";
    if (t.includes("liab")) return "Liability";
    if (t.includes("indemni")) return "Indemnification";
    if (t.includes("warrant")) return "Warranty";
    if (t.includes("terminat") || t.includes("term")) return "Termination";
    if (t.includes("governing") || t.includes("jurisdiction")) return "Governing Law";
    if (t.includes("dispute") || t.includes("arbitration")) return "Dispute Resolution";
    if (t.includes("force majeure")) return "Force Majeure";
    if (t.includes("employ")) return "Employment";
    if (t.includes("compete")) return "Non-Compete";
    if (t.includes("solicit")) return "Non-Solicitation";
    if (t.includes("data") || t.includes("privacy")) return "Data Privacy";
    if (t.includes("misc") || t.includes("general")) return "Miscellaneous";
    
    return "Other";
  }
}
