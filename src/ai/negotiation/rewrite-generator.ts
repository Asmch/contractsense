import { Type, Schema } from "@google/genai";
import { GeminiProvider } from "../providers/gemini.provider";
import { NEGOTIATION_SYSTEM_PROMPT } from "../prompts/contract-sense-ai-standard";

export interface RewriteGeneratorResult {
  suggestedRewrite: string;
  acceptanceProbability: number;
  negotiationConfidence: number;
}

const RewriteGeneratorGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    suggestedRewrite: { 
      type: Type.STRING,
      description: "A balanced, realistic revision of the risky clause. Use simple English. Make it sound human and fair." 
    },
    acceptanceProbability: { 
      type: Type.NUMBER, 
      description: "Estimated probability (0-100) that the counterparty will accept this rewrite."
    },
    negotiationConfidence: {
      type: Type.NUMBER,
      description: "Your confidence score (0-100) in this suggested rewrite."
    }
  },
  required: ["suggestedRewrite", "acceptanceProbability", "negotiationConfidence"]
};

export class RewriteGenerator {
  static async generateRewrite(clauseContent: string, riskExplanation: string): Promise<{ result: RewriteGeneratorResult; tokensUsed: number }> {
    const prompt = `
Original Clause:
${clauseContent}

Identified Risk:
${riskExplanation}

Provide a balanced, realistic rewrite of this clause that mitigates the risk while remaining fair to both parties.
`;
    const systemInstruction = NEGOTIATION_SYSTEM_PROMPT;

    const response = await GeminiProvider.generateStructuredResponse<RewriteGeneratorResult>(
      prompt,
      RewriteGeneratorGeminiSchema,
      systemInstruction
    );

    return {
      result: response.data,
      tokensUsed: response.usage.totalTokens
    };
  }
}
