import { GeminiProvider } from "@/ai/providers/gemini.provider";
import { STANDARD_SYSTEM_PROMPT } from "@/ai/prompts/contract-sense-ai-standard";
import { Schema, Type } from "@google/genai";
import { IComparisonClause } from "@/database/models/ComparisonClause";
import { IContractClause } from "@/database/models/ContractClause";

export interface ComparisonSummaryResult {
  executiveSummary: string;
  keyLegalChanges: string[];
  reviewRecommendations: string[];
  clauseAnalysis: Array<{
    revisedClauseId: string | null;
    originalClauseId: string | null;
    changeSeverity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    businessImpact: string;
    legalImpact: string;
    aiDifferenceExplanation: string;
  }>;
}

export class ComparisonSummaryService {
  
  static async generateSummary(
    differences: Partial<IComparisonClause>[],
    originalClauses: IContractClause[],
    revisedClauses: IContractClause[]
  ): Promise<ComparisonSummaryResult> {
    
    // 1. Prepare Data for Gemini
    const diffDataForAi = differences.map(diff => {
      const orig = originalClauses.find(c => c._id?.toString() === diff.originalClauseId?.toString());
      const rev = revisedClauses.find(c => c._id?.toString() === diff.revisedClauseId?.toString());
      
      return {
        originalClauseId: diff.originalClauseId?.toString() || null,
        revisedClauseId: diff.revisedClauseId?.toString() || null,
        status: diff.status,
        originalText: orig ? orig.content : null,
        revisedText: rev ? rev.content : null,
        riskDelta: diff.riskDelta
      };
    }).filter(d => d.status !== "UNCHANGED"); // We only need AI to analyze changes!

    const prompt = `
Analyze the differences between the original contract version and the revised version.

Differences to analyze:
${JSON.stringify(diffDataForAi, null, 2)}
`;

    const systemInstruction = `
${STANDARD_SYSTEM_PROMPT}

You are helping a user understand what changed between two versions of a document. 

For the overall summary, provide a concise "executiveSummary" (a friendly summary), a list of "keyLegalChanges" (What changed), and "reviewRecommendations" (What you should do).

For EACH modified, added, or removed clause:
Assign a changeSeverity (LOW, MEDIUM, HIGH, CRITICAL).
Determine the "businessImpact" (e.g., "You now have 90 days to pay instead of 30").
Determine the "legalImpact" (e.g., "You are now responsible for any damages").
Provide a short "aiDifferenceExplanation" of what changed and why it matters, in simple terms.
`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        executiveSummary: { type: Type.STRING },
        keyLegalChanges: { 
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        reviewRecommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        clauseAnalysis: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalClauseId: { type: Type.STRING, nullable: true },
              revisedClauseId: { type: Type.STRING, nullable: true },
              changeSeverity: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"] },
              businessImpact: { type: Type.STRING },
              legalImpact: { type: Type.STRING },
              aiDifferenceExplanation: { type: Type.STRING }
            },
            required: ["changeSeverity", "businessImpact", "legalImpact", "aiDifferenceExplanation"]
          }
        }
      },
      required: ["executiveSummary", "keyLegalChanges", "reviewRecommendations", "clauseAnalysis"]
    };

    const { data } = await GeminiProvider.generateStructuredResponse<ComparisonSummaryResult>(
      prompt,
      responseSchema,
      systemInstruction
    );

    return data;
  }
}
