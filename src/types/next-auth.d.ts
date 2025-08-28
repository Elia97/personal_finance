import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

type UserRole = "USER" | "ADMIN";
type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      picture?: string | null;
      id: string;
      role?: UserRole | null;
      status?: UserStatus | null;
      language?: string | null;
      country?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: UserRole | null;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    phone?: string | null;
    language?: string | null;
    country?: string | null;
    dateOfBirth?: Date | null;
    status?: UserStatus | null;
    lastLogin?: Date | null;
    emailVerified?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    settings?: JsonValue;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role?: UserRole | null;
    status?: UserStatus | null;
    language?: string | null;
    country?: string | null;
    iat?: number | null; // Aggiungi esplicitamente la proprietà iat
    exp?: number | null; // (Opzionale) Aggiungi exp se necessario
    nbf?: number | null; // (Opzionale) Aggiungi nbf se necessario
  }
}
