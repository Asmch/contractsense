import mongoose, { Schema, Document } from "mongoose";

export interface IComparisonClause extends Document {
  comparisonId: mongoose.Types.ObjectId;
  originalClauseId?: mongoose.Types.ObjectId;
  revisedClauseId?: mongoose.Types.ObjectId;
  status: "UNCHANGED" | "MODIFIED" | "REMOVED" | "ADDED";
  riskDelta: number;
  matchConfidence: number;
  changeSeverity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  businessImpact?: string;
  legalImpact?: string;
  aiDifferenceExplanation?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComparisonClauseSchema = new Schema<IComparisonClause>(
  {
    comparisonId: { type: Schema.Types.ObjectId, ref: "Comparison", required: true, index: true },
    originalClauseId: { type: Schema.Types.ObjectId, ref: "ContractClause" },
    revisedClauseId: { type: Schema.Types.ObjectId, ref: "ContractClause" },
    status: {
      type: String,
      enum: ["UNCHANGED", "MODIFIED", "REMOVED", "ADDED"],
      required: true
    },
    riskDelta: { type: Number, default: 0 },
    matchConfidence: { type: Number, default: 0 },
    changeSeverity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    },
    businessImpact: { type: String },
    legalImpact: { type: String },
    aiDifferenceExplanation: { type: String }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.ComparisonClause;
}

export const ComparisonClauseModel = mongoose.models.ComparisonClause || mongoose.model<IComparisonClause>("ComparisonClause", ComparisonClauseSchema);
