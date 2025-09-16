import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";
import { redirect } from "@/i18n/navigation";
import { findUserById } from "@/app/repositories/user-repository";
import { User, UserProfile } from "next-auth";
import { sendEmail } from "./resend";

/**
 * Ottieni la sessione sul server
 */
export async function getAuthSession(): Promise<Session | null> {
  return (await getServerSession(authOptions)) as Session | null;
}

/**
 * Richiedi autenticazione - redirect se non autenticato
 */
export async function requireAuth(locale: string): Promise<Session> {
  const session = await getAuthSession();
  if (!session) {
    redirect({ href: "/auth/signin", locale });
    throw new Error("Redirected to signin");
  }
  return session;
}

/**
 * Controlla se l'account è attivo
 */
export async function requireActiveStatus(locale: string): Promise<Session> {
  const session = await requireAuth(locale);
  if (!session.user || session.user.status !== "ACTIVE") {
    redirect({ href: "/account-suspended", locale });
    throw new Error("Redirected to account suspended");
  }
  return session;
}

/**
 * Controlla se l'utente ha uno dei ruoli specificati
 */
export async function hasAnyRole(
  roles: ("USER" | "ADMIN")[],
): Promise<boolean> {
  const session = await getAuthSession();
  if (!session) return false;
  return roles.includes(session.user.role || "USER");
}

/**
 * Controlla se l'utente è admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasAnyRole(["ADMIN"]);
}

export async function getUserLocale(): Promise<Partial<User>> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  const user = await findUserById(session.user.id, {
    language: true,
    country: true,
  });

  return {
    language: user?.language || null,
    country: user?.country || null,
  };
}

export async function getUserProfile(): Promise<UserProfile> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  const user = (await findUserById(session.user.id, {
    id: true,
    name: true,
    email: true,
    phone: true,
    image: true,
    language: true,
    country: true,
    dateOfBirth: true,
    lastLogin: true,
    emailVerified: true,
    settings: true,
    createdAt: true,
    _count: {
      select: {
        accounts: true,
        transactions: true,
        goals: true,
        investments: true,
      },
    },
  })) as UserProfile | null;

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/**
 * Hash password per le credenziali
 */
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Verifica password
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  const subject = "Personal Finance - Verifica la tua email";
  const text = `Clicca sul seguente link per verificare la tua email: ${verificationUrl}`;

  await sendEmail(email, subject, text);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  const subject = "Personal Finance - Reimpostazione della password";
  const text = `Clicca sul seguente link per reimpostare la tua password: ${resetUrl}`;

  await sendEmail(email, subject, text);
}
