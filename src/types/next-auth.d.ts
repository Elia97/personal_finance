import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { UserRole, UserStatus } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id: string;
      role?: UserRole | null;
      status?: UserStatus | null;
      language?: string | null;
      country?: string | null;
      rememberMe?: boolean | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: UserRole | null;
    phone?: string | null;
    language?: string | null;
    country?: string | null;
    dateOfBirth?: Date | null;
    status?: UserStatus | null;
    lastLogin?: Date | null;
    emailVerified?: Date | null;
    rememberMe?: boolean | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    settings?: JsonValue;
  }

  interface UserProfile extends User {
    _count: {
      bankAccounts: number;
      transactions: number;
      goals: number;
      investments: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role?: UserRole | null;
    status?: UserStatus | null;
    language?: string | null;
    country?: string | null;
    rememberMe?: boolean | null;
    iat?: number | null;
    exp?: number | null;
    nbf?: number | null;
  }
}
