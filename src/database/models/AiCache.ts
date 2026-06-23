import mongoose, { Schema, Document } from "mongoose";

export interface IAiCache extends Document {
  promptHash: string;
  response: string;
  aiModel: string;
  createdAt: Date;
}

const AiCacheSchema = new Schema<IAiCache>(
  {
    promptHash: { type: String, required: true, unique: true, index: true },
    response: { type: String, required: true },
    aiModel: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 } // Auto-delete after 7 days
  }
);

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.AiCache;
}

export const AiCacheModel = mongoose.models.AiCache || mongoose.model<IAiCache>("AiCache", AiCacheSchema);
