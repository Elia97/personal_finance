import prisma from "@/lib/prisma";
import type { Account, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

/**
 * This function manages user access by verifying the user's email status.
 *
 * - For users registered through an external provider:
 *   - Access is denied if the email address is not verified.
 *
 * - For users registered with credentials:
 *   - Access is denied if the email address is not verified within 30 days of registration.
 *
 * Logs are generated to indicate the reason for access denial or approval.
 *
 * @param user - The user object containing details about the authenticated user.
 * @param account - The account object containing details about the authentication provider.
 * @returns A boolean indicating whether the user is authorized to access the application.
 */
export async function signIn({
  user,
  account,
}: {
  user: User;
  account: Account | undefined;
}) {
  if (account?.provider !== "credentials") {
    if (user.email && !user.emailVerified) return false;
  } else {
    const currentDate = new Date();
    const createdAt = user.createdAt ? new Date(user.createdAt) : undefined;
    if (
      user.email &&
      !user.emailVerified &&
      createdAt &&
      (currentDate.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) > 30
    ) {
      return false;
    }
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
  user?: User;
  trigger?: "signIn" | "signUp" | "update";
  session?: Partial<Session>;
}): Promise<JWT> {
  // Helper per aggiornare il token con i dati dell'utente
  const updateTokenWithUserData = (userData: Partial<User>) => {
    token.name = userData.name || token.name;
    token.email = userData.email || token.email;
    token.picture = userData.image || token.picture;
    token.id = userData.id || token.id;
    token.role = userData.role || token.role;
    token.status = userData.status || token.status;
    token.language = userData.language || token.language;
    token.country = userData.country || token.country;
  };

  // On first login, add user information to the token
  if (user) {
    updateTokenWithUserData(user);
  }

  // If it's a session update trigger, update the token and database
  if (trigger === "update" && session?.user) {
    updateTokenWithUserData(session.user);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        language: session.user.language,
        country: session.user.country,
      },
    });
  }

  // Periodically refresh user data from the database (every hour)
  if (
    token.id &&
    (typeof token.iat !== "number" ||
      Date.now() - Number(token.iat) * 1000 > 60 * 60 * 1000)
  ) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id },
        select: {
          name: true,
          email: true,
          image: true,
          id: true,
          role: true,
          status: true,
          language: true,
          country: true,
        },
      });

      if (dbUser) {
        updateTokenWithUserData(dbUser);
      } else {
        console.error(
          `Error during token refresh: User with ID ${token.id} not found.`
        );
      }
    } catch (error) {
      console.error("Error during token refresh: ", error);
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
      id: token.id,
      name: token.name,
      email: token.email,
      role: token.role,
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
  if (url.startsWith("/")) return `${baseUrl}${url}`;
  if (new URL(url).origin === baseUrl) return url;
  return baseUrl;
}
