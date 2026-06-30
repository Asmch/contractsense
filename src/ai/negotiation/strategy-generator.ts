import { Type, Schema } from "@google/genai";
import { GeminiProvider } from "../providers/gemini.provider";
import { NEGOTIATION_SYSTEM_PROMPT } from "../prompts/contract-sense-ai-standard";

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
      description: "Friendly, ready-to-use sentences the user can say to the other party to ask for a change. Use 'You' and 'Your'." 
    },
    idealPosition: { type: Type.STRING, description: "The best realistic outcome you should ask for." },
    fallbackPosition: { type: Type.STRING, description: "A compromise position if they say no." },
    marketStandard: { type: Type.STRING, description: "Short phrase describing what is normal (e.g., '30-day payment terms')." },
    marketStandardReason: { type: Type.STRING, description: "Simple explanation of why this is normal." }
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
    const systemInstruction = NEGOTIATION_SYSTEM_PROMPT;

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
