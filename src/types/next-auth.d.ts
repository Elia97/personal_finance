import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type UserRole = "USER" | "ADMIN";
type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      phone?: string | null;
      language?: string | null;
      country?: string | null;
      dateOfBirth?: Date | null;
      status?: UserStatus;
      lastLogin?: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: UserRole;
    phone?: string | null;
    language?: string | null;
    country?: string | null;
    dateOfBirth?: Date | null;
    status?: UserStatus;
    lastLogin?: Date | null;
    settings?: Record<string, unknown>; // JSON field
    password?: string;
    emailVerified?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: UserRole;
    phone?: string;
    language?: string;
    country?: string;
    status?: UserStatus;
    lastLogin?: Date;
    emailVerified?: Date | null;
  }
}
