import { z } from "zod";

/**
 * Roles a user is allowed to self-select at signup.
 * ADMIN is intentionally excluded — admin accounts are provisioned
 * out-of-band (seed script / direct DB), never through a public API.
 */
export const SELF_SERVICE_ROLES = ["STUDENT", "OWNER"] as const;

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters") // bcrypt's input limit
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  role: z.enum(SELF_SERVICE_ROLES).default("STUDENT"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
