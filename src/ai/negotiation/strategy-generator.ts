import { Type, Schema } from "@google/genai";
import { GeminiProvider } from "../providers/gemini.provider";

export interface StrategyGeneratorResult {
  talkingPoints: string[];
  idealPosition: string;
  fallbackPosition: string;
  marketStandard: string;
  marketStandardReason: string;
}

const StrategyGeneratorGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    talkingPoints: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Ready-to-use negotiation arguments for the user (e.g., 'Unlimited liability is uncommon'). Max 3." 
    },
    idealPosition: { type: Type.STRING, description: "The best realistic outcome the user could negotiate for." },
    fallbackPosition: { type: Type.STRING, description: "A compromise position if the ideal is rejected." },
    marketStandard: { type: Type.STRING, description: "Short phrase describing the industry standard (e.g., '30-day payment terms')." },
    marketStandardReason: { type: Type.STRING, description: "Explanation of why this is the market standard." }
  },
  required: ["talkingPoints", "idealPosition", "fallbackPosition", "marketStandard", "marketStandardReason"]
};

export class StrategyGenerator {
  static async generateStrategy(clauseType: string, clauseContent: string, riskExplanation: string): Promise<{ result: StrategyGeneratorResult; tokensUsed: number }> {
    const prompt = `
Clause Type: ${clauseType}
Original Clause:
${clauseContent}

Identified Risk:
${riskExplanation}

Generate a negotiation strategy including talking points, ideal position, fallback position, and market standard information.
`;
    const systemInstruction = "You are an expert contract negotiation advisor. Provide actionable, plain-language talking points and realistic negotiation positions for freelancers and founders.";

    const response = await GeminiProvider.generateStructuredResponse<StrategyGeneratorResult>(
      prompt,
      StrategyGeneratorGeminiSchema,
      systemInstruction
    );

    return {
      result: response.data,
      tokensUsed: response.usage.totalTokens
    };
  }
}
