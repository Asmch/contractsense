import { Type, Schema } from "@google/genai";
import { z } from "zod";

export const SummaryGeneratorZodSchema = z.object({
  executiveSummary: z.string(),
  keyTakeaways: z.array(z.string())
});

export type SummaryGeneratorResult = z.infer<typeof SummaryGeneratorZodSchema>;

export const SummaryGeneratorGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { 
      type: Type.STRING,
      description: "A 2-3 sentence professional executive summary of the entire contract, noting its general fairness and any major red flags." 
    },
    keyTakeaways: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "An array of 3 to 5 key takeaways or bullet points summarizing the most important aspects or risks of the contract."
    }
  },
  required: ["executiveSummary", "keyTakeaways"]
};

export const getSummaryGeneratorSystemInstruction = () => `
You are an expert contract lawyer. You will be provided with a list of extracted clauses and their associated risk analyses from a contract.
Your task is to synthesize this information into a high-level executive summary and a list of key takeaways for a startup founder.
Avoid legal jargon. Focus on business impact.
`;

export const getSummaryGeneratorPrompt = (clausesData: string) => `
Analyze the following clause data and generate a summary:

${clausesData}
`;
