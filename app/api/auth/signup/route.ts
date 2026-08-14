import { prisma } from "@/lib/prisma";
import { ok, fail, withErrorHandling } from "@/lib/api-response";
import { signupSchema } from "@/lib/validations/auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const POST = withErrorHandling(async (req: Request) => {
  // Cap signups per IP to slow down automated account-creation abuse.
  const ip = getClientIp(req);
  const limit = rateLimit(`signup:${ip}`, 5, 60 * 1000); // 5 requests / minute
  if (!limit.success) {
    return fail("Too many signup attempts. Please try again in a minute.", 429);
  }

  const body = await req.json();
  const parsed = signupSchema.parse(body);

  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) {
    return fail("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(parsed.password, SALT_ROUNDS);

  // SECURITY: role comes only from the validated enum (STUDENT | OWNER).
  // ADMIN can never be self-assigned here -- it must be granted manually.
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      passwordHash,
      role: parsed.role,
      isVerified: parsed.role === "OWNER" ? false : true,
    },
    select: { id: true, email: true, role: true },
  });

  return ok(user, 201);
});
