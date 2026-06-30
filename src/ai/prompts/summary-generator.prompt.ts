import { Type, Schema } from "@google/genai";
import { z } from "zod";
import { STANDARD_SYSTEM_PROMPT } from "./contract-sense-ai-standard";

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
      description: "A 2-3 sentence friendly summary of the entire contract, noting its general fairness and any major red flags. Answer 'Why should I care?' in the first paragraph. If the contract is standard and safe, say so!" 
    },
    keyTakeaways: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "An array of 3 to 5 key takeaways or bullet points summarizing what this means for the user. Use 'You' and 'Your'."
    }
  },
  required: ["executiveSummary", "keyTakeaways"]
};

export const getSummaryGeneratorSystemInstruction = () => `
${STANDARD_SYSTEM_PROMPT}

You will be provided with a list of extracted clauses and their associated risk analyses from a contract.
Your specific task is to synthesize this information into a high-level contract summary and a list of key takeaways.
`;

export const getSummaryGeneratorPrompt = (clausesData: string) => `
Analyze the following clause data and generate a summary:

${clausesData}
`;
