import mongoose, { Schema, Document } from "mongoose";

export interface IComparison extends Document {
  originalVersionId: mongoose.Types.ObjectId;
  revisedVersionId: mongoose.Types.ObjectId;
  contractId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  overallRiskDelta: number;
  overallChange: "RISK_INCREASED" | "RISK_REDUCED" | "NO_SIGNIFICANT_CHANGE";
  executiveSummary?: string;
  keyLegalChanges?: string[];
  reviewRecommendations?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ComparisonSchema = new Schema<IComparison>(
  {
    originalVersionId: { type: Schema.Types.ObjectId, ref: "ContractVersion", required: true },
    revisedVersionId: { type: Schema.Types.ObjectId, ref: "ContractVersion", required: true },
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    overallRiskDelta: { type: Number, default: 0 },
    overallChange: {
      type: String,
      enum: ["RISK_INCREASED", "RISK_REDUCED", "NO_SIGNIFICANT_CHANGE"],
      default: "NO_SIGNIFICANT_CHANGE"
    },
    executiveSummary: { type: String },
    keyLegalChanges: [{ type: String }],
    reviewRecommendations: [{ type: String }]
  },
  { timestamps: true }
);

// Ensure a user can only have one comparison between the exact same two versions
ComparisonSchema.index({ originalVersionId: 1, revisedVersionId: 1 }, { unique: true });

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Comparison;
}

export const ComparisonModel = mongoose.models.Comparison || mongoose.model<IComparison>("Comparison", ComparisonSchema);
