import { GeminiProvider } from "../providers/gemini.provider";
import { 
  ClauseAnalysisGeminiSchema,
  ClauseAnalysisZodSchema,
  BatchClauseAnalysisGeminiSchema, 
  ClauseAnalysisResult, 
  getClauseAnalysisSystemInstruction, 
  getBatchClauseAnalysisPrompt
} from "../prompts/clause-analysis.prompt";

export class ClauseAnalyzer {
  /**
   * Analyzes an array of clauses using Gemini in a single API call to prevent rate limiting.
   */
  static async analyzeClausesBatch(clauses: { id: string; title: string; content: string }[]): Promise<{ 
    results: { clauseId: string; analysis: ClauseAnalysisResult }[]; 
    tokensUsed: number;
  }> {
    if (clauses.length === 0) return { results: [], tokensUsed: 0 };

    // Map the actual Mongo IDs to deterministic index strings (e.g. "idx_0", "idx_1").
    const deterministicClauses = clauses.map((c, index) => ({
      id: `idx_${index}`,
      title: c.title,
      content: c.content
    }));

    const prompt = getBatchClauseAnalysisPrompt(deterministicClauses);
    const systemInstruction = getClauseAnalysisSystemInstruction();

    const response = await GeminiProvider.generateStructuredResponse<{ results: { clauseId: string; analysis: ClauseAnalysisResult }[] }>(
      prompt,
      BatchClauseAnalysisGeminiSchema,
      systemInstruction
    );

    // Map the deterministic IDs back to the real Mongo IDs
    const finalResults = response.data.results.map((res: { clauseId: string; analysis: ClauseAnalysisResult }) => {
      const originalIndex = parseInt(res.clauseId.replace("idx_", ""), 10);
      const realClause = clauses[originalIndex];
      return {
        clauseId: realClause ? realClause.id : res.clauseId, 
        analysis: res.analysis
      };
    });

    return {
      results: finalResults,
      tokensUsed: response.usage.totalTokens
    };
  }

  /**
   * Analyzes a single critical clause (Adaptive Batching Strategy)
   */
  static async analyzeSingleClause(clause: { id: string; title: string; content: string }): Promise<{
    result: ClauseAnalysisResult;
    tokensUsed: number;
  }> {
    const prompt = `Analyze the following single clause. Return your analysis in the required JSON format.
    
    Clause Title: ${clause.title}
    Clause Content:
    ${clause.content}
    `;
    
    const systemInstruction = getClauseAnalysisSystemInstruction();

    const response = await GeminiProvider.generateStructuredResponse<ClauseAnalysisResult>(
      prompt,
      ClauseAnalysisGeminiSchema,
      systemInstruction
    );

    return {
      result: response.data,
      tokensUsed: response.usage.totalTokens
    };
  }
}
