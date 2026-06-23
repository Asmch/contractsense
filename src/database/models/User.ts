import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  provider?: "EMAIL" | "GOOGLE";
  role: "admin" | "user" | "guest";
  image?: string;
  stripeCustomerId?: string; // Placeholder for billing
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, select: false },
    provider: { type: String, enum: ["EMAIL", "GOOGLE"], default: "EMAIL" },
    role: { type: String, enum: ["admin", "user", "guest"], default: "user" },
    image: { type: String },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

delete mongoose.models.User;
export const UserModel = mongoose.model<IUser>("User", UserSchema);
