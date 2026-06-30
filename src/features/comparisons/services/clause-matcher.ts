import { IContractClause } from "@/database/models/ContractClause";
import { GeminiProvider } from "@/ai/providers/gemini.provider";

export interface MatchedClausePair {
  originalClause?: IContractClause;
  revisedClause?: IContractClause;
  status: "UNCHANGED" | "MODIFIED" | "REMOVED" | "ADDED";
  matchConfidence: number;
}

// Compute cosine similarity between two embedding vectors
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simple Levenshtein distance for fallback/exactness checks
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
  for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
      }
    }
  }
  return matrix[b.length][a.length];
}

export class ClauseMatcher {
  
  static async matchClauses(
    originalClauses: IContractClause[],
    revisedClauses: IContractClause[]
  ): Promise<MatchedClausePair[]> {
    
    const matches: MatchedClausePair[] = [];
    const unmatchedOriginals = [...originalClauses];
    const unmatchedRevised = [...revisedClauses];

    // 1. Exact / High-Confidence Match (Title + Type)
    for (let i = unmatchedRevised.length - 1; i >= 0; i--) {
      const revClause = unmatchedRevised[i];
      const matchIndex = unmatchedOriginals.findIndex(orig => 
        orig.title.toLowerCase() === revClause.title.toLowerCase() && 
        orig.clauseType === revClause.clauseType
      );

      if (matchIndex !== -1) {
        const origClause = unmatchedOriginals[matchIndex];
        
        // Exact content match = UNCHANGED, else MODIFIED
        const isContentExact = origClause.content.trim() === revClause.content.trim();
        
        matches.push({
          originalClause: origClause,
          revisedClause: revClause,
          status: isContentExact ? "UNCHANGED" : "MODIFIED",
          matchConfidence: 100 // Exact title match is 100% confidence
        });

        unmatchedOriginals.splice(matchIndex, 1);
        unmatchedRevised.splice(i, 1);
      }
    }

    // If both are empty, we're done
    if (unmatchedOriginals.length === 0 && unmatchedRevised.length === 0) {
      return matches;
    }

    // 2. Semantic Similarity Match for remaining
    // Get embeddings for remaining clauses
    const origEmbeddings = await Promise.all(unmatchedOriginals.map(c => GeminiProvider.generateEmbedding(c.content)));
    const revEmbeddings = await Promise.all(unmatchedRevised.map(c => GeminiProvider.generateEmbedding(c.content)));

    for (let i = unmatchedRevised.length - 1; i >= 0; i--) {
      const revClause = unmatchedRevised[i];
      const revEmb = revEmbeddings[i];
      
      let bestMatchIdx = -1;
      let highestSimilarity = -1;

      for (let j = 0; j < unmatchedOriginals.length; j++) {
        const origEmb = origEmbeddings[j];
        if (!origEmb) continue;
        
        const sim = cosineSimilarity(origEmb, revEmb);
        if (sim > highestSimilarity) {
          highestSimilarity = sim;
          bestMatchIdx = j;
        }
      }

      // If semantic similarity is > 0.85, consider it a match (Modified)
      if (bestMatchIdx !== -1 && highestSimilarity > 0.85) {
        const origClause = unmatchedOriginals[bestMatchIdx];
        const isContentExact = origClause.content.trim() === revClause.content.trim();
        
        matches.push({
          originalClause: origClause,
          revisedClause: revClause,
          status: isContentExact ? "UNCHANGED" : "MODIFIED",
          matchConfidence: Math.round(highestSimilarity * 100)
        });

        unmatchedOriginals.splice(bestMatchIdx, 1);
        origEmbeddings.splice(bestMatchIdx, 1);
        unmatchedRevised.splice(i, 1);
        revEmbeddings.splice(i, 1);
      }
    }

    // 3. Mark remaining unmatched original clauses as REMOVED
    for (const origClause of unmatchedOriginals) {
      matches.push({
        originalClause: origClause,
        status: "REMOVED",
        matchConfidence: 0
      });
    }

    // 4. Mark remaining unmatched revised clauses as ADDED
    for (const revClause of unmatchedRevised) {
      matches.push({
        revisedClause: revClause,
        status: "ADDED",
        matchConfidence: 0
      });
    }

    return matches;
  }
}
