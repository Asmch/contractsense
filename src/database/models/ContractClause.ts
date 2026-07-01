import mongoose, { Schema, Document } from "mongoose";

export interface IContractClause extends Document {
  contractId: mongoose.Types.ObjectId;
  versionId?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  clauseType: "Payment Terms" | "Confidentiality" | "Intellectual Property" | "Liability" | "Indemnification" | "Warranty" | "Termination" | "Governing Law" | "Dispute Resolution" | "Force Majeure" | "Employment" | "Non-Compete" | "Non-Solicitation" | "Data Privacy" | "Miscellaneous" | "Other" | "OTHER";
  order: number;
  confidenceScore: number;
  boundaryConfidence?: number;
  detectedBy?: "HEADER" | "NUMBERED_SECTION" | "ROMAN_NUMERAL" | "KEYWORD_HEURISTIC" | "STRUCTURAL_ANALYSIS" | "HYBRID";
  detectionReason?: string;
  sourceLocation?: { start: number; end: number };
  hierarchyLevel?: number;
  clauseNumber?: string;
  riskScore: number | null;
  // Phase 3 AI Fields
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  explanation?: string;
  concerns?: string[];
  recommendations?: string[];
  rawAiResponse?: string;
  // Phase 5 AI Negotiation Fields
  negotiationAdvice?: string;
  suggestedRewrite?: string;
  riskReductionScore?: number;
  negotiationDifficulty?: "Easy" | "Medium" | "Hard";
  marketStandard?: string;
  marketStandardReason?: string;
  negotiationPriority?: "Must Fix" | "Recommended" | "Optional" | "None";
  negotiationConfidence?: number;
  acceptanceProbability?: number;
  fallbackPosition?: string;
  idealPosition?: string;
  talkingPoints?: string[];
  
  clauseInsight?: {
    plainExplanation?: string;
    whyItMatters?: string;
    userImpact?: string;
    triggerPhrases?: string[];
    highlightRanges?: { start: number; end: number }[];
    reasonFlagged?: string;
    realLifeExample?: string;
    howCommonIsThis?: string;
    needsHumanReview?: boolean;
    shouldYouWorry?: "Not Really" | "Worth Discussing" | "Don't Ignore";
    canIgnore?: boolean;
    recommendedAction?: "SAFE" | "REVIEW" | "NEGOTIATE" | "LAWYER";
    businessImpact?: {
      ifAccepted?: string;
      ifIgnored?: string;
    };
    confidenceReason?: string;
    conversationStarter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ContractClauseSchema = new Schema<IContractClause>(
  {
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true, index: true },
    versionId: { type: Schema.Types.ObjectId, ref: "ContractVersion", index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    clauseType: {
      type: String,
      enum: ["Payment Terms", "Confidentiality", "Intellectual Property", "Liability", "Indemnification", "Warranty", "Termination", "Governing Law", "Dispute Resolution", "Force Majeure", "Employment", "Non-Compete", "Non-Solicitation", "Data Privacy", "Miscellaneous", "Other", "OTHER"],
      default: "Other"
    },
    order: { type: Number, required: true },
    confidenceScore: { type: Number, default: 100 },
    boundaryConfidence: { type: Number },
    detectedBy: {
      type: String,
      enum: ["HEADER", "NUMBERED_SECTION", "ROMAN_NUMERAL", "KEYWORD_HEURISTIC", "STRUCTURAL_ANALYSIS", "HYBRID"]
    },
    detectionReason: { type: String },
    sourceLocation: {
      start: { type: Number },
      end: { type: Number }
    },
    hierarchyLevel: { type: Number },
    clauseNumber: { type: String },
    riskScore: { type: Number, default: null },
    // Phase 3 AI Fields
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    },
    explanation: { type: String },
    concerns: [{ type: String }],
    recommendations: [{ type: String }],
    rawAiResponse: { type: String },
    // Phase 5 AI Negotiation Fields
    negotiationAdvice: { type: String },
    suggestedRewrite: { type: String },
    riskReductionScore: { type: Number },
    negotiationDifficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    marketStandard: { type: String },
    marketStandardReason: { type: String },
    negotiationPriority: { type: String, enum: ["Must Fix", "Recommended", "Optional", "None"] },
    negotiationConfidence: { type: Number },
    acceptanceProbability: { type: Number },
    fallbackPosition: { type: String },
    idealPosition: { type: String },
    talkingPoints: [{ type: String }],
    
    clauseInsight: {
      plainExplanation: { type: String },
      whyItMatters: { type: String },
      userImpact: { type: String },
      triggerPhrases: [{ type: String }],
      highlightRanges: [{
        start: { type: Number },
        end: { type: Number }
      }],
      reasonFlagged: { type: String },
      realLifeExample: { type: String },
      howCommonIsThis: { type: String },
      needsHumanReview: { type: Boolean },
      shouldYouWorry: { type: String, enum: ["Not Really", "Worth Discussing", "Don't Ignore"] },
      canIgnore: { type: Boolean },
      recommendedAction: { type: String, enum: ["SAFE", "REVIEW", "NEGOTIATE", "LAWYER"] },
      businessImpact: {
        ifAccepted: { type: String },
        ifIgnored: { type: String }
      },
      confidenceReason: { type: String },
      conversationStarter: { type: String }
    }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.ContractClause;
}

export const ContractClauseModel = mongoose.models.ContractClause || mongoose.model<IContractClause>("ContractClause", ContractClauseSchema);
