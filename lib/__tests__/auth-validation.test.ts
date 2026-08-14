import { describe, it, expect } from "vitest";
import { signupSchema } from "../validations/auth";

describe("signupSchema", () => {
  const validBase = {
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "9876543210",
    password: "Passw0rd123",
  };

  it("accepts a valid STUDENT signup", () => {
    const result = signupSchema.safeParse({ ...validBase, role: "STUDENT" });
    expect(result.success).toBe(true);
  });

  it("accepts a valid OWNER signup", () => {
    const result = signupSchema.safeParse({ ...validBase, role: "OWNER" });
    expect(result.success).toBe(true);
  });

  it("defaults role to STUDENT when omitted", () => {
    const result = signupSchema.parse({ ...validBase });
    expect(result.role).toBe("STUDENT");
  });

  // Regression test for the privilege-escalation bug: role must never
  // accept ADMIN from a public-facing schema.
  it("rejects an ADMIN role", () => {
    const result = signupSchema.safeParse({ ...validBase, role: "ADMIN" });
    expect(result.success).toBe(false);
  });

  it("rejects a weak password with no uppercase or digit", () => {
    const result = signupSchema.safeParse({ ...validBase, password: "weakpassword" });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed phone number", () => {
    const result = signupSchema.safeParse({ ...validBase, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = signupSchema.safeParse({ ...validBase, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("normalizes email to lowercase", () => {
    const result = signupSchema.parse({ ...validBase, email: "Priya@Example.COM" });
    expect(result.email).toBe("priya@example.com");
  });
});
