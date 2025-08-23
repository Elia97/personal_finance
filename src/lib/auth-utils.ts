import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ExtendedSession } from "@/types/auth";
import { redirect } from "next/navigation";
import prisma from "./prisma";

/**
 * Ottieni la sessione sul server
 */
export async function getAuthSession(): Promise<ExtendedSession | null> {
  return (await getServerSession(authOptions)) as ExtendedSession | null;
}

/**
 * Richiedi autenticazione - redirect se non autenticato
 */
export async function requireAuth(locale: string): Promise<ExtendedSession> {
  const session = await getAuthSession();

  if (!session) {
    redirect(`/${locale}/auth/signin`);
  }

  return session;
}

/**
 * Richiedi un ruolo specifico
 */
export async function requireRole(
  role: "USER" | "ADMIN"
): Promise<ExtendedSession> {
  const session = await requireAuth("en"); // Sostituire con il locale appropriato

  if (session.user.role !== role) {
    redirect("/unauthorized");
  }

  return session;
}

/**
 * Controlla se l'utente ha uno dei ruoli specificati
 */
export async function hasAnyRole(
  roles: ("USER" | "ADMIN")[]
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

/**
 * Controlla se l'account è attivo
 */
export async function requireActiveStatus(): Promise<ExtendedSession> {
  const session = await requireAuth("en"); // Sostituire con il locale appropriato

  if (session.user.status !== "ACTIVE") {
    redirect("/account-suspended");
  }

  return session;
}

/**
 * Ottieni preferenze utente dal campo settings
 */
export async function getUserSettings(userId: string): Promise<unknown> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  return user?.settings || {};
}

/**
 * Aggiorna preferenze utente
 */
export async function updateUserSettings(
  userId: string,
  settings: unknown
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { settings: settings === null ? undefined : settings },
  });
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
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Genera un token di verifica email
 */
import { randomBytes } from "crypto";

export function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}
