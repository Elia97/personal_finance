import prisma from "@/lib/prisma";
import type { ExtendedJWT } from "@/types/auth";
import type { AdapterUser } from "next-auth/adapters";
import type { Account, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

export async function signIn({
  user,
  account,
  isNewUser,
}: {
  user: User;
  account: Account | null;
  isNewUser?: boolean;
}) {
  console.log(`New login: ${user.email} via ${account?.provider}`);

  // Add custom logic here, such as logging or analytics
  if (isNewUser) {
    console.log(`New user registered: ${user.email}`);
  }

  return true;
}

export async function jwt({
  token,
  user,
  trigger,
  session,
}: {
  token: JWT;
  user?: User | AdapterUser;
  trigger?: "signIn" | "signUp" | "update";
  session?: Partial<Session>;
}): Promise<JWT> {
  // On first login, add user information to the token
  if (user) {
    token.id = user.id;
    token.role = (user as ExtendedJWT).role ?? undefined;
    token.phone = (user as ExtendedJWT).phone ?? undefined;
    token.language = (user as ExtendedJWT).language ?? undefined;
    token.country = (user as ExtendedJWT).country ?? undefined;
    token.status = (user as ExtendedJWT).status ?? undefined;
    token.lastLogin = (user as ExtendedJWT).lastLogin ?? undefined;
    token.emailVerified = (user as ExtendedJWT).emailVerified;
  }

  // If it's a session update trigger, update the token
  if (trigger === "update" && session) {
    const sessionWithProps = session as { name?: string; email?: string };
    token.name = sessionWithProps.name ?? token.name;
    token.email = sessionWithProps.email ?? token.email;
  }

  // Periodically refresh user data from the database (every hour)
  if (
    token.id &&
    (typeof token.iat !== "number" ||
      Date.now() - Number(token.iat) * 1000 > 60 * 60 * 1000)
  ) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          phone: true,
          language: true,
          country: true,
          status: true,
          lastLogin: true,
          emailVerified: true,
        },
      });

      if (dbUser) {
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.image;
        token.role = dbUser.role ?? undefined;
        token.phone = dbUser.phone ?? undefined;
        token.language = dbUser.language ?? undefined;
        token.country = dbUser.country ?? undefined;
        token.status = dbUser.status ?? undefined;
        token.lastLogin = dbUser.lastLogin ?? undefined;
        token.emailVerified = dbUser.emailVerified;
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
    }
  }

  return token;
}

export async function session({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}): Promise<Session> {
  const extendedSession: Session = {
    ...session,
    user: {
      id: token.id as string,
      name: token.name ?? "",
      email: token.email ?? "",
      image: token.picture ?? undefined,
      role: (token as ExtendedJWT).role ?? "USER",
      phone: (token as ExtendedJWT).phone ?? undefined,
      language: (token as ExtendedJWT).language ?? undefined,
      country: (token as ExtendedJWT).country ?? undefined,
      status: (token as ExtendedJWT).status ?? "ACTIVE",
      lastLogin: (token as ExtendedJWT).lastLogin ?? undefined,
    },
  };

  return extendedSession;
}

export async function redirect({
  url,
  baseUrl,
}: {
  url: string;
  baseUrl: string;
}) {
  // Allow redirects only within the app's domain
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  if (new URL(url).origin === baseUrl) return url;
  return baseUrl;
}
