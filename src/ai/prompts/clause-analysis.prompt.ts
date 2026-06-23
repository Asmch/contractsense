import { Type, Schema } from "@google/genai";
import { z } from "zod";

export const ClauseAnalysisZodSchema = z.object({
  cleanTitle: z.string(),
  clauseType: z.string(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  riskScore: z.number(),
  confidenceScore: z.number(),
  explanation: z.string(),
  concerns: z.array(z.string()),
  recommendations: z.array(z.string())
});

export type ClauseAnalysisResult = z.infer<typeof ClauseAnalysisZodSchema>;

// The Gemini Schema for structured outputs
export const ClauseAnalysisGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cleanTitle: {
      type: Type.STRING,
      description: "A clean, standardized title for this clause without numbering or messy prefixes (e.g., 'Termination' instead of '12.4 Termination of Agreement')"
    },
    clauseType: { 
      type: Type.STRING,
      enum: ["Payment Terms", "Confidentiality", "Intellectual Property", "Liability", "Indemnification", "Warranty", "Termination", "Governing Law", "Dispute Resolution", "Force Majeure", "Employment", "Non-Compete", "Non-Solicitation", "Data Privacy", "Miscellaneous", "Other"],
      description: "The primary legal category of this clause. Evaluate the text carefully and select the best fit." 
    },
    riskLevel: { 
      type: Type.STRING, 
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      description: "The risk level associated with this clause." 
    },
    riskScore: { 
      type: Type.INTEGER,
      description: "A risk score from 0 (completely safe) to 100 (extremely dangerous/critical)."
    },
    confidenceScore: {
      type: Type.INTEGER,
      description: "Your confidence in this risk analysis from 0 to 100."
    },
    explanation: { 
      type: Type.STRING,
      description: "A plain English explanation of the clause, avoiding legal jargon. Explain it like talking to a startup founder."
    },
    concerns: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of specific risks or concerns found in the clause (e.g., 'Unlimited liability detected'). Empty array if safe."
    },
    recommendations: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Actionable recommendations on how to negotiate or fix this clause. Empty array if safe."
    }
  },
  required: ["cleanTitle", "clauseType", "riskLevel", "riskScore", "confidenceScore", "explanation", "concerns", "recommendations"]
};

export const BatchClauseAnalysisGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      description: "An array of analysis results for each provided clause.",
      items: {
        type: Type.OBJECT,
        properties: {
          clauseId: { type: Type.STRING, description: "The exact ID of the clause provided" },
          analysis: ClauseAnalysisGeminiSchema
        },
        required: ["clauseId", "analysis"]
      }
    }
  },
  required: ["results"]
};

export const getClauseAnalysisSystemInstruction = () => `
You are an expert contract lawyer reviewing a contract for a startup founder. 
Your job is to analyze the provided legal clauses and return a strict JSON object detailing their risks.

Follow these rules:
1. Translate legal jargon into simple, plain English.
2. Flag common risks aggressively (e.g., unlimited liability, broad IP transfer, one-sided termination).
3. If the clause is standard and safe, set riskScore low (0-30), riskLevel to LOW, and concerns/recommendations to empty arrays.
4. Provide actionable recommendations for high-risk items.
`;

export const getBatchClauseAnalysisPrompt = (clauses: { id: string; title: string; content: string }[]) => `
Analyze the following clauses. Return your analysis in the required JSON format, ensuring you include the exact clauseId for each result.

Clauses to analyze:
${clauses.map(c => `
---
Clause ID: ${c.id}
Title: ${c.title}
Content:
${c.content}
`).join('\n')}
`;
