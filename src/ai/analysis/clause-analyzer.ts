import { GeminiProvider } from "../providers/gemini.provider";
import { 
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
    // This ensures that re-uploading the exact same document generates the EXACT SAME prompt string,
    // leading to a perfect 100% Cache Hit rate and saving API limits during testing!
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
    const finalResults = response.data.results.map(res => {
      // res.clauseId will be "idx_0", "idx_1", etc.
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
}
