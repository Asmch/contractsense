import mongoose, { Schema, Document } from "mongoose";

export interface IChatSession extends Document {
  contractId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>(
  {
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String }
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.ChatSession;
}

export const ChatSessionModel = mongoose.models.ChatSession || mongoose.model<IChatSession>("ChatSession", ChatSessionSchema);
