import mongoose, { Schema, Document } from "mongoose";

export interface IContractVersion extends Document {
  contractId: mongoose.Types.ObjectId;
  versionNumber: number;
  fileUrl: string; // Cloudinary or S3 URL
  fileType: string;
  originalFileName: string;
  textContent?: string; // Extracted plain text for analysis
  createdAt: Date;
  updatedAt: Date;
}

const ContractVersionSchema = new Schema<IContractVersion>(
  {
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
    versionNumber: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    originalFileName: { type: String, required: true },
    textContent: { type: String }, // Populated post-processing
  },
  { timestamps: true }
);

// Ensure version numbers are unique per contract
ContractVersionSchema.index({ contractId: 1, versionNumber: 1 }, { unique: true });

export const ContractVersionModel = mongoose.models.ContractVersion || mongoose.model<IContractVersion>("ContractVersion", ContractVersionSchema);
