import { z } from "zod";

const envSchema = z.object({
  // Node Env
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Database
  MONGODB_URI: z.string().url("Must be a valid MongoDB connection string"),
  
  // Authentication (Auth.js)
  NEXTAUTH_URL: z.string().url().optional(), // Optional in Vercel
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  
  // AI Provider (e.g. OpenAI)
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required for AI layer"),
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
