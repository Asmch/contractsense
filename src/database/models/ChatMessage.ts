import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  sessionId: mongoose.Types.ObjectId;
  role: "user" | "assistant" | "system";
  content: string;
  citations: Array<{
    clauseId: mongoose.Types.ObjectId;
    title: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "ChatSession", required: true, index: true },
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    citations: [
      {
        clauseId: { type: Schema.Types.ObjectId, ref: "ContractClause" },
        title: { type: String }
      }
    ]
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.ChatMessage;
}

export const ChatMessageModel = mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
