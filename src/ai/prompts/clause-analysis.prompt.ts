import { Type, Schema } from "@google/genai";
import { z } from "zod";
import { STANDARD_SYSTEM_PROMPT } from "./contract-sense-ai-standard";

// Export z to satisfy any stuck Turbopack cache importing it from here
export { z };

export const ClauseAnalysisZodSchema = z.object({
  cleanTitle: z.string(),
  clauseType: z.string(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  riskScore: z.number(),
  
  clauseInsight: z.object({
    triggerPhrases: z.array(z.string()),
    reasonFlagged: z.string(),
    plainExplanation: z.string(),
    whyItMatters: z.string(),
    userImpact: z.string(),
    howCommonIsThis: z.string(),
    shouldYouWorry: z.enum(["Not Really", "Worth Discussing", "Don't Ignore"]),
    canIgnore: z.boolean(),
    recommendedAction: z.enum(["SAFE", "REVIEW", "NEGOTIATE", "LAWYER"]),
    needsHumanReview: z.boolean(),
    businessImpact: z.object({
      ifAccepted: z.string(),
      ifIgnored: z.string()
    }),
    conversationStarter: z.string(),
    confidenceReason: z.string(),
    realLifeExample: z.string()
  }),
  
  negotiationPriority: z.enum(["Must Fix", "Recommended", "Optional", "None"]),
  negotiationDifficulty: z.enum(["Easy", "Medium", "Hard"]),
  confidenceLevel: z.enum(["Low", "Medium", "High"])
});

export type ClauseAnalysisResult = z.infer<typeof ClauseAnalysisZodSchema>;

// The Gemini Schema for structured outputs
export const ClauseAnalysisGeminiSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cleanTitle: {
      type: Type.STRING,
      description: "A clean, standardized title for this clause without numbering or messy prefixes."
    },
    clauseType: { 
      type: Type.STRING,
      enum: ["Payment Terms", "Confidentiality", "Intellectual Property", "Liability", "Indemnification", "Warranty", "Termination", "Governing Law", "Dispute Resolution", "Force Majeure", "Employment", "Non-Compete", "Non-Solicitation", "Data Privacy", "Miscellaneous", "Other"],
      description: "The primary legal category of this clause." 
    },
    riskLevel: { 
      type: Type.STRING, 
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      description: "Overall risk level." 
    },
    riskScore: { 
      type: Type.INTEGER,
      description: "A risk score from 0 (completely safe) to 100 (critical)."
    },
    
    clauseInsight: {
      type: Type.OBJECT,
      properties: {
        triggerPhrases: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Extract the exact words or phrases that caused your decision. Only extract text that actually exists. Never paraphrase."
        },
        reasonFlagged: {
          type: Type.STRING,
          description: "Why these phrases stood out (e.g., 'These phrases usually indicate that ownership of work transfers to the client.')"
        },
        plainExplanation: {
          type: Type.STRING,
          description: "What is this about? Explain what this clause means for the user in plain English."
        },
        whyItMatters: {
          type: Type.STRING,
          description: "Why should you care? Explain the fundamental reason this clause exists and its importance."
        },
        userImpact: {
          type: Type.STRING,
          description: "What could happen? Provide a concrete scenario using 'If you...' to illustrate the impact."
        },
        realLifeExample: {
          type: Type.STRING,
          description: "Provide an everyday, non-legal real life example."
        },
        howCommonIsThis: {
          type: Type.STRING,
          description: "Provide a conversational insight on commonality (e.g., 'Common in employment contracts, but rare in freelance agreements.')."
        },
        shouldYouWorry: {
          type: Type.STRING,
          enum: ["Not Really", "Worth Discussing", "Don't Ignore"]
        },
        canIgnore: {
          type: Type.BOOLEAN,
          description: "True if they can safely ignore this. False if they must pay attention or negotiate."
        },
        recommendedAction: {
          type: Type.STRING,
          enum: ["SAFE", "REVIEW", "NEGOTIATE", "LAWYER"]
        },
        needsHumanReview: {
          type: Type.BOOLEAN,
          description: "True if this clause is highly unusual, complex, or ambiguous and specifically needs a human lawyer to review."
        },
        businessImpact: {
          type: Type.OBJECT,
          properties: {
            ifAccepted: { type: Type.STRING, description: "Example: 'You retain full ownership of your reusable code.'" },
            ifIgnored: { type: Type.STRING, description: "Example: 'The client owns all work, preventing you from reusing your code.'" }
          },
          required: ["ifAccepted", "ifIgnored"]
        },
        conversationStarter: {
          type: Type.STRING,
          description: "A natural, professional way to start negotiating this. (e.g. 'Would you be open to adjusting this clause so that...?')"
        },
        confidenceReason: {
          type: Type.STRING,
          description: "Why you made these conclusions based on the text provided."
        }
      },
      required: [
        "triggerPhrases", "reasonFlagged", "plainExplanation", "whyItMatters", "userImpact", 
        "howCommonIsThis", "shouldYouWorry", "canIgnore", "recommendedAction", "needsHumanReview",
        "businessImpact", "conversationStarter", "confidenceReason", "realLifeExample"
      ]
    },
    
    negotiationPriority: {
      type: Type.STRING,
      enum: ["Must Fix", "Recommended", "Optional", "None"]
    },
    negotiationDifficulty: {
      type: Type.STRING,
      enum: ["Easy", "Medium", "Hard"]
    },
    confidenceLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"]
    }
  },
  required: [
    "cleanTitle", "clauseType", "riskLevel", "riskScore", "clauseInsight",
    "negotiationPriority", "negotiationDifficulty", "confidenceLevel"
  ]
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
${STANDARD_SYSTEM_PROMPT}

Your specific task is to analyze the provided legal clauses and return a strict JSON object detailing their risks.
You MUST provide values for all fields in the schema.

CRITICAL RULES:
1. ALWAYS extract the exact, verbatim words or short phrases (e.g. "exclusive property") into \`triggerPhrases\` that caused you to flag the clause. Never paraphrase. Only use text that actually exists.
2. NEVER make assumptions. If the wording is ambiguous, say it is ambiguous. Never invent intent. Never exaggerate risk.
3. ONLY explain what exists in the clause. Never explain what is missing.
4. Assume an 8th-grade reading level. Use short sentences, everyday English, and active voice.
5. Explain decisions, not documents. Focus on whether the user can safely sign.
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
