import prisma from "@/lib/prisma";
import type { Account, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import logger from "./logger";

// Log user sign-in events
export async function signInEvent({
  user,
  account,
}: {
  user: User;
  account?: Account | null;
}) {
  logger.info(`User signed in via ${account?.provider}: ${user.id}`);
}

// Log user sign-out events
export async function signOutEvent({ token }: { token: JWT }) {
  logger.info(`User signed out: ${token.id}`);
}

// Log user creation events
export async function createUserEvent({ user }: { user: User }) {
  logger.info(`User created: ${user.id}`);
}

// Log account linking events
export async function linkAccountEvent({
  user,
  account,
  profile,
}: {
  user: User;
  account: Account;
  profile: User;
}) {
  if (account.provider !== "credentials" && account.providerAccountId) {
    const profileImage = profile?.image; // Assumi che il provider fornisca un'immagine
    if (profileImage && !user.image) {
      await prisma.user
        .update({
          where: { id: user.id },
          data: { image: profileImage },
        })
        .catch((error: Error) => {
          logger.error(
            `Error updating user ${user.id} image: ${error.message}`
          );
        });
    }
    await prisma.user
      .update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      })
      .catch((error: Error) => {
        logger.error(
          `Error updating user ${user.id} email verification: ${error.message}`
        );
      });
  }
  logger.info(
    `User ${user.id} linked account ${account.provider}: ${profile.email}`
  );
}
