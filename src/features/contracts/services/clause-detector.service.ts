import { IContractClause } from "@/database/models/ContractClause";

export class ClauseDetectorService {
  static detectClauses(text: string, contractId: string): Partial<IContractClause>[] {
    // Split by paragraphs (double newlines)
    let paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p);
    
    let rawClauses = this.segmentParagraphs(paragraphs, contractId);

    // Validation Gate: Too Few Clauses (Under-segmentation)
    const totalWords = text.split(/\s+/).length;
    if (totalWords > 1000 && rawClauses.length < 7) {
      console.log(`[ClauseDetector] Validation Failed: Found ${rawClauses.length} clauses for ${totalWords} words. Triggering aggressive fallback segmentation.`);
      
      const aggressiveParagraphs: string[] = [];
      const lines = text.split(/\n/);
      let currentPara = "";
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          if (currentPara) {
            aggressiveParagraphs.push(currentPara.trim());
            currentPara = "";
          }
          continue;
        }
        
        if (trimmed.length < 80 && !trimmed.endsWith('.') && !trimmed.endsWith(';') && !trimmed.endsWith(',')) {
          if (currentPara) aggressiveParagraphs.push(currentPara.trim());
          aggressiveParagraphs.push(trimmed);
          currentPara = "";
        } else {
          currentPara += (currentPara ? " " : "") + trimmed;
        }
      }
      if (currentPara) aggressiveParagraphs.push(currentPara.trim());

      rawClauses = this.segmentParagraphs(aggressiveParagraphs, contractId);
    }

    // Validation Gate: Too Many Fragments (Over-segmentation)
    if (rawClauses.length > 30) {
      const avgLength = rawClauses.reduce((sum, c) => sum + (c.content?.split(/\s+/).length || 0), 0) / rawClauses.length;
      if (avgLength < 30) {
        console.log(`[ClauseDetector] Validation Failed: Over-segmented (${rawClauses.length} clauses, avg ${Math.round(avgLength)} words). Merging fragments.`);
        rawClauses = this.mergeFragments(rawClauses, true);
      } else {
        rawClauses = this.mergeFragments(rawClauses, false);
      }
    } else {
      rawClauses = this.mergeFragments(rawClauses, false);
    }

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
         detectionReason: "Fallback - no boundaries detected"
      });
    }

    rawClauses.forEach((c, i) => {
      c.order = i;
      if (c.content) c.content = c.content.trim();
    });

    return rawClauses;
  }

  private static segmentParagraphs(paragraphs: string[], contractId: string): Partial<IContractClause>[] {
    const rawClauses: Partial<IContractClause>[] = [];
    let currentClause: Partial<IContractClause> | null = null;
    let order = 0;

    for (const p of paragraphs) {
      const match = this.evaluateHierarchy(p);
      
      if (match.isBoundary) {
        if (currentClause && currentClause.content!.trim().length > 0) {
          rawClauses.push(currentClause);
        }
        
        let cleanTitle = p.replace(/^(\d+\.[\d\.]*\s+|[IVX]+\.\s+|ARTICLE\s+[IVX\d]+\s*[:\-]?\s*|\([a-z]\)\s+|SECTION\s+\d+\s*[:\-]?\s*)/i, '').trim();
        cleanTitle = cleanTitle.replace(/[:\.\-;]+$/, '').trim();

        if (!cleanTitle || cleanTitle.length > 100) cleanTitle = p.substring(0, 60) + "...";

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
          clauseNumber: match.clauseNumber,
          hierarchyLevel: match.hierarchyLevel
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
            hierarchyLevel: 0
          };
        } else {
          currentClause.content += `\n\n${p}`;
        }
      }
    }

    if (currentClause && currentClause.content!.trim().length > 0) {
      rawClauses.push(currentClause);
    }
    
    return rawClauses;
  }

  private static evaluateHierarchy(p: string) {
    const text = p.trim();
    if (!text) return { isBoundary: false };

    const articleRegex = /^(?:ARTICLE|SECTION|CLAUSE|PART)\s+([A-Z0-9IVX]+)[\.:\-\s]*/i;
    const topNumberRegex = /^(\d+)[\.\-]\s+/;
    const subNumberRegex = /^(\d+\.\d+(?:\.\d+)?)\.?\s+/;
    
    const isAllCaps = /^[^a-z]{3,100}$/.test(text) && !text.includes('\n');
    
    const words = text.split(/\s+/);
    const isShort = text.length > 5 && text.length < 120;
    const isNotSentence = !text.endsWith('.') && !text.endsWith(';') && !text.includes(' shall ') && !text.includes(' will ');
    const titleCaseCount = words.filter(w => /^[A-Z]/.test(w)).length;
    const isTitleCase = isShort && isNotSentence && (titleCaseCount / words.length > 0.6);

    const legalKeywords = /^(Definitions|Confidentiality|Term|Termination|Payment|Fees|Liability|Indemnification|Indemnity|Warranties|Warranty|Intellectual Property|Governing Law|Dispute Resolution|Force Majeure|Miscellaneous|General Provisions|Notices|Severability|Waiver)\b/i;
    const startsWithKeyword = legalKeywords.test(text);
    
    if (articleRegex.test(text) && isShort) {
       return { isBoundary: true, detectedBy: "ROMAN_NUMERAL", hierarchyLevel: 0, clauseNumber: text.match(articleRegex)?.[1], confidenceScore: 98, boundaryConfidence: 95, detectionReason: "Top level article/section label" };
    }
    if (subNumberRegex.test(text) && isShort) {
       return { isBoundary: true, detectedBy: "NUMBERED_SECTION", hierarchyLevel: 1, clauseNumber: text.match(subNumberRegex)?.[1], confidenceScore: 92, boundaryConfidence: 85, detectionReason: "Nested numbered section" };
    }
    if (topNumberRegex.test(text) && isShort) {
       return { isBoundary: true, detectedBy: "NUMBERED_SECTION", hierarchyLevel: 0, clauseNumber: text.match(topNumberRegex)?.[1], confidenceScore: 95, boundaryConfidence: 90, detectionReason: "Top level numbered section" };
    }
    
    if (isAllCaps) {
       return { isBoundary: true, detectedBy: "HEADER", hierarchyLevel: 0, confidenceScore: 85, boundaryConfidence: 80, detectionReason: "ALL CAPS standalone formatting" };
    }
    
    if (isTitleCase || (startsWithKeyword && isShort && isNotSentence)) {
       return { isBoundary: true, detectedBy: "HEADER", hierarchyLevel: 0, confidenceScore: 80, boundaryConfidence: 75, detectionReason: "Title case or legal keyword formatting" };
    }

    return { isBoundary: false };
  }

  private static mergeFragments(clauses: Partial<IContractClause>[], aggressive: boolean): Partial<IContractClause>[] {
    const merged: Partial<IContractClause>[] = [];
    
    for (let i = 0; i < clauses.length; i++) {
      const current = clauses[i];
      
      if (merged.length > 0) {
        const prev = merged[merged.length - 1];
        
        const wordCount = current.content!.split(/\s+/).length;
        
        const isOrphan = aggressive 
          ? (wordCount < 40 && prev.hierarchyLevel !== 0 && current.detectedBy !== "ROMAN_NUMERAL")
          : (wordCount < 15 && !current.clauseNumber && current.detectedBy !== "ROMAN_NUMERAL");
          
        if (isOrphan) {
          prev.content += `\n\n${current.content}`;
          continue;
        }
      }
      
      merged.push(current);
    }

    return merged;
  }

  private static categorizeClause(title: string): IContractClause["clauseType"] {
    const t = title.toLowerCase();
    if (t.includes("payment") || t.includes("fee") || t.includes("compensation") || t.includes("invoice") || t.includes("capital")) return "Payment Terms";
    if (t.includes("confidential") || t.includes("non-disclosure") || t.includes("nda")) return "Confidentiality";
    if (t.includes("intellectual property") || t.includes("ip ") || t.includes("ownership") || t.includes("license") || t.includes("proprietary")) return "Intellectual Property";
    if (t.includes("liab")) return "Liability";
    if (t.includes("indemni")) return "Indemnification";
    if (t.includes("warrant") || t.includes("representation")) return "Warranty";
    if (t.includes("terminat") || t.includes("term ") || t.includes("withdrawal") || t.includes("dissolution")) return "Termination";
    if (t.includes("governing") || t.includes("jurisdiction") || t.includes("law")) return "Governing Law";
    if (t.includes("dispute") || t.includes("arbitration") || t.includes("mediation")) return "Dispute Resolution";
    if (t.includes("force majeure")) return "Force Majeure";
    if (t.includes("employ") || t.includes("contractor") || t.includes("personnel")) return "Employment";
    if (t.includes("compete") || t.includes("competition")) return "Non-Compete";
    if (t.includes("solicit")) return "Non-Solicitation";
    if (t.includes("data") || t.includes("privacy") || t.includes("security")) return "Data Privacy";
    if (t.includes("misc") || t.includes("general") || t.includes("entire agreement") || t.includes("severability") || t.includes("waiver")) return "Miscellaneous";
    
    return "Other";
  }
}
