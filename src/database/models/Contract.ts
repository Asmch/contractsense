import mongoose, { Schema, Document } from "mongoose";

export interface IContract extends Document {
  title: string;
  ownerId: mongoose.Types.ObjectId;
  status: "UPLOADED" | "PARSING" | "ANALYZING" | "READY" | "COMPLETE" | "FAILED" | "RATE_LIMITED" | "SEGMENTATION_REVIEW_REQUIRED";
  currentVersionId?: mongoose.Types.ObjectId;
  fileUrl?: string; // Phase 1 uploaded URL
  rawText?: string;
  pageCount?: number;
  wordCount?: number;
  fileSize?: number;
  mimeType?: string;
  fileName?: string;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingLogs: Array<{
    stage: string;
    timestamp: Date;
    message: string;
  }>;
  tags?: string[];
  // Phase 3 AI Additions
  analysisProgress?: {
    clausesAnalyzed: boolean;
    scoringComplete: boolean;
    summaryGenerated: boolean;
    negotiationAnalyzed: boolean;
  };
  aiUsage?: {
    provider: string;
    model: string;
    tokensUsed: number;
    estimatedCost: number;
  };
  analysisVersion?: string;
  safetyScore?: number;
  riskLevel?: string;
  executiveSummary?: string;
  keyTakeaways?: string[];
  analyzedAt?: Date;
  // Phase 5 AI Negotiation Fields
  executiveNegotiationReport?: {
    whatToNegotiateFirst: string[];
    whatToNegotiateSecond: string[];
    whatCanBeIgnored: string[];
  };
  // Phase 6 Granular Risk Engine
  missingClauses?: string[];
  crossClauseConflicts?: string[];
  riskEngine?: {
    overallRisk: number;
    legalRisk: number;
    financialRisk: number;
    operationalRisk: number;
    complianceRisk: number;
    privacyRisk: number;
    employmentRisk: number;
    intellectualPropertyRisk: number;
  };
  scoreExplanation?: Array<{
    reason: string;
    impact: number;
    type: "BONUS" | "PENALTY";
  }>;
  // Phase 6.5 Sprint 13 Discoveries
  discoveries?: Array<{
    id: string;
    type: "success" | "warning" | "info";
    message: string;
    detail: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    title: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["UPLOADED", "PARSING", "ANALYZING", "READY", "COMPLETE", "FAILED", "RATE_LIMITED", "SEGMENTATION_REVIEW_REQUIRED"],
      default: "UPLOADED"
    },
    currentVersionId: { type: Schema.Types.ObjectId, ref: "ContractVersion" },
    tags: [{ type: String }],
    fileUrl: { type: String },
    rawText: { type: String, default: "" },
    pageCount: { type: Number, default: 0 },
    wordCount: { type: Number, default: 0 },
    fileSize: { type: Number },
    mimeType: { type: String },
    fileName: { type: String },
    processingStartedAt: { type: Date },
    processingCompletedAt: { type: Date },
    processingLogs: [
      {
        stage: { type: String },
        timestamp: { type: Date, default: Date.now },
        message: { type: String }
      }
    ],
    // Phase 3 AI Fields
    analysisProgress: {
      clausesAnalyzed: { type: Boolean, default: false },
      scoringComplete: { type: Boolean, default: false },
      summaryGenerated: { type: Boolean, default: false },
      negotiationAnalyzed: { type: Boolean, default: false }
    },
    aiUsage: {
      provider: { type: String },
      model: { type: String },
      tokensUsed: { type: Number, default: 0 },
      estimatedCost: { type: Number, default: 0 }
    },
    analysisVersion: { type: String },
    safetyScore: { type: Number },
    riskLevel: { type: String },
    executiveSummary: { type: String },
    keyTakeaways: [{ type: String }],
    analyzedAt: { type: Date },
    executiveNegotiationReport: {
      whatToNegotiateFirst: [{ type: String }],
      whatToNegotiateSecond: [{ type: String }],
      whatCanBeIgnored: [{ type: String }]
    },
    // Phase 6 Fields
    missingClauses: [{ type: String }],
    crossClauseConflicts: [{ type: String }],
    riskEngine: {
      overallRisk: { type: Number },
      legalRisk: { type: Number },
      financialRisk: { type: Number },
      operationalRisk: { type: Number },
      complianceRisk: { type: Number },
      privacyRisk: { type: Number },
      employmentRisk: { type: Number },
      intellectualPropertyRisk: { type: Number }
    },
    scoreExplanation: [{
      reason: { type: String },
      impact: { type: Number },
      type: { type: String, enum: ["BONUS", "PENALTY"] }
    }],
    discoveries: [{
      id: { type: String },
      type: { type: String, enum: ["success", "warning", "info"] },
      message: { type: String },
      detail: { type: String },
      timestamp: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Contract;
}

export const ContractModel = mongoose.models.Contract || mongoose.model<IContract>("Contract", ContractSchema);
