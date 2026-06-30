import { GoogleGenAI, Type, Schema } from "@google/genai";
import crypto from "crypto";
import { AiCacheModel } from "../../database/models/AiCache";
import { connectToDatabase } from "../../database/connection";

// Sleep utility function
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class GeminiProvider {
  /**
   * Generates a structured JSON response from Gemini using Structured Outputs.
   * Includes exponential backoff for rate limits (429) and high demand (503).
   * 
   * @param prompt The prompt to send to the model
   * @param responseSchema The exact schema to enforce on the output
   * @param systemInstruction Optional system instruction for the model
   * @returns The parsed structured response and token usage metrics
   */
  static async generateStructuredResponse<T>(
    prompt: string,
    responseSchema: Schema,
    systemInstruction?: string,
    maxRetries: number = 5
  ): Promise<{ data: T; usage: { totalTokens: number } }> {

    await connectToDatabase();

    const model = "gemini-2.5-flash";

    // 1. Check persistent AI Cache
    const hashInput = JSON.stringify({ model, prompt, responseSchema, systemInstruction });
    const promptHash = crypto.createHash("sha256").update(hashInput).digest("hex");

    const cached = await AiCacheModel.findOne({ promptHash });
    if (cached) {
      console.log(`[AI Cache Hit] Reusing cached response for prompt (Hash: ${promptHash.substring(0, 8)}...)`);
      return {
        data: JSON.parse(cached.response) as T,
        usage: { totalTokens: 0 } // Costs 0 tokens when cached!
      };
    }

    // Initialize inside the function to ensure environment variables are loaded by Next.js
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.1, // Keep it low for analytical consistency
          }
        });

        if (!response.text) {
          throw new Error("Empty response received from Gemini");
        }

        const data = JSON.parse(response.text) as T;
        const totalTokens = response.usageMetadata?.totalTokenCount || 0;

        // Save to cache asynchronously so we don't block the return
        AiCacheModel.create({
          promptHash,
          response: response.text,
          aiModel: model
        }).catch(err => console.error("Failed to save AI Cache", err));

        return {
          data,
          usage: {
            totalTokens
          }
        };
      } catch (error: any) {
        lastError = error;

        // If it's a hard 429 Quota Rate Limit, we want to pause the entire pipeline instead of sleeping in the background.
        if (error.message?.includes("429") || error.status === 429) {

          // --- MOCK FALLBACK FOR DEVELOPMENT ---
          // If the user has completely exhausted their daily free tier Google API quota,
          // we gracefully fall back to mock data so they can continue testing the app.
          if (process.env.NODE_ENV === "development") {
            console.warn("⚠️ API Rate Limit completely exhausted. Falling back to Mock AI Response to unblock development...");

            if (prompt.includes("Analyze the following clauses")) {
              // Extract clause IDs from prompt to generate matching mock results
              const clauseIds = [...prompt.matchAll(/Clause ID: (idx_\d+)/g)].map(m => m[1]);

              const mockData = {
                results: clauseIds.map(id => ({
                  clauseId: id,
                  analysis: {
                    clauseType: "Other",
                    riskLevel: "MEDIUM",
                    riskScore: 50,
                    explanation: "This is a mock AI analysis generated because the Google API rate limit was exhausted.",
                    concerns: ["Mock concern 1", "Mock concern 2"],
                    recommendations: ["Mock recommendation 1"]
                  }
                }))
              };
              return { data: mockData as any as T, usage: { totalTokens: 0 } };
            }

            if (prompt.includes("generate a summary") || systemInstruction?.includes("executive summary")) {
              const mockData = {
                executiveSummary: "This is a mock executive summary generated because the Google API rate limit was exhausted. Please check back tomorrow when the quota resets.",
                keyTakeaways: ["API Rate Limit Exceeded", "Using Mock Data for Testing"]
              };
              return { data: mockData as any as T, usage: { totalTokens: 0 } };
            }

            // If we somehow miss both, just return a generic mock based on the schema keys
            console.warn("Mock fallback could not determine prompt type. Returning generic mock.");
            return { data: {} as any as T, usage: { totalTokens: 0 } };
          }
          // -------------------------------------

          let waitTimeSecs = 60; // Default to 60s
          const retryMatch = error.message?.match(/retry in (\d+(\.\d+)?)s/i);
          if (retryMatch && retryMatch[1]) {
            waitTimeSecs = Math.ceil(parseFloat(retryMatch[1])) + 1;
          }
          throw new Error(`RATE_LIMIT_EXCEEDED:${waitTimeSecs}`);
        }

        // If it's a 503 (High Demand / Server Busy), we can still use small exponential backoff
        const isUnavailable = error.message?.includes("503") || error.status === 503;

        if (isUnavailable && attempt < maxRetries) {
          let delay = Math.pow(2, attempt) * 2000;
          console.log(`Gemini API high demand (503) (Attempt ${attempt + 1}/${maxRetries}). Sleeping for ${delay}ms...`);
          await sleep(delay);
          continue;
        }

        // If it's not a retryable error or we've run out of retries, break and throw
        break;
      }
    }

    console.error("Gemini Provider Error:", lastError);
    throw new Error(`AI generation failed after ${maxRetries} retries: ${lastError?.message || 'Unknown error'}`);
  }

  /**
   * Generates a text embedding array for semantic similarity search.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    try {
      const response = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text,
      });

      if (!response.embeddings || !response.embeddings[0] || !response.embeddings[0].values) {
        throw new Error("Failed to generate embedding");
      }

      return response.embeddings[0].values;
    } catch (error) {
      console.error("Embedding generation failed:", error);
      throw error;
    }
  }
}
