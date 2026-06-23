import { GeminiProvider } from "../providers/gemini.provider";
import { 
  SummaryGeneratorGeminiSchema, 
  SummaryGeneratorResult, 
  getSummaryGeneratorSystemInstruction, 
  getSummaryGeneratorPrompt 
} from "../prompts/summary-generator.prompt";
import { IContractClause } from "@/database/models/ContractClause";

export class SummaryGenerator {
  /**
   * Generates a high-level summary and key takeaways from a list of analyzed clauses.
   */
  static async generateSummary(clauses: IContractClause[]): Promise<{ result: SummaryGeneratorResult; tokensUsed: number }> {
    
    // Condense the clause data to save tokens and focus the AI on the most important parts
    const clauseDataStr = clauses.map(c => `
      Type: ${c.clauseType}
      Risk Level: ${c.riskLevel}
      Risk Score: ${c.riskScore}/100
      Explanation: ${c.explanation}
      Concerns: ${c.concerns?.join(', ') || 'None'}
    `).join('\n---\n');

    const prompt = getSummaryGeneratorPrompt(clauseDataStr);
    const systemInstruction = getSummaryGeneratorSystemInstruction();

    const response = await GeminiProvider.generateStructuredResponse<SummaryGeneratorResult>(
      prompt,
      SummaryGeneratorGeminiSchema,
      systemInstruction
    );

    return {
      result: response.data,
      tokensUsed: response.usage.totalTokens
    };
  }
}
