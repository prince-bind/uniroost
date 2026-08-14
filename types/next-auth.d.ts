import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role: "STUDENT" | "OWNER" | "ADMIN";
      isVerified: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "STUDENT" | "OWNER" | "ADMIN";
    isVerified: boolean;
  }
}