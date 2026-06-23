import mongoose, { Schema, Document } from "mongoose";

export interface IContractProcessingLog extends Document {
  contractId: mongoose.Types.ObjectId;
  timestamp: Date;
  step: string;
  message: string;
  severity: "INFO" | "WARNING" | "ERROR";
  createdAt: Date;
  updatedAt: Date;
}

const ContractProcessingLogSchema = new Schema<IContractProcessingLog>(
  {
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true, index: true },
    timestamp: { type: Date, default: Date.now },
    step: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ["INFO", "WARNING", "ERROR"], default: "INFO" }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.ContractProcessingLog;
}

export const ContractProcessingLogModel = mongoose.models.ContractProcessingLog || mongoose.model<IContractProcessingLog>("ContractProcessingLog", ContractProcessingLogSchema);
