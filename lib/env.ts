import { z } from "zod";

/**
 * Validates process.env once at startup instead of letting a missing
 * env var surface as a confusing runtime error deep inside a request
 * (e.g. `Cannot read properties of undefined` from an unset CLOUDINARY_*).
 * Import this from a file that always loads early (e.g. instrumentation
 * or the root layout) if you want hard-fail-fast behaviour.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgres")),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET should be at least 32 chars"),
  NEXTAUTH_URL: z.string().url().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("[invalid_env]", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration. Check .env against .env.example.");
  }
  cached = parsed.data;
  return cached;
}
