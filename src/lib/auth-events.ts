import prisma from "@/lib/prisma";
import type { Account, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Log user sign-in events
export async function signInEvent({
  user,
  account,
}: {
  user: User;
  account?: Account | undefined;
}) {
  await prisma.log.create({
    data: {
      event: "signIn",
      email: user?.email || "",
      provider: account?.provider || "",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      createdAt: new Date(),
    },
  });
}

// Log user sign-out events
export async function signOutEvent({ token }: { token: JWT }) {
  await prisma.log.create({
    data: {
      event: "signOut",
      email: token?.email || "",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      createdAt: new Date(),
    },
  });
}

// Log user creation events
export async function createUserEvent({ user }: { user: User }) {
  await prisma.log.create({
    data: {
      event: "createUser",
      email: user?.email || "",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      createdAt: new Date(),
    },
  });
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
      console.log(`Updating user image for ${user.email}`);
      await prisma.user
        .update({
          where: { email: user.email ?? "" },
          data: { image: profileImage },
        })
        .catch((error) => {
          console.error("Error updating user image:", error);
        });
    }
    await prisma.user
      .update({
        where: { email: user.email ?? "" },
        data: { emailVerified: new Date() },
      })
      .catch((error) => {
        console.error("Error updating email verification:", error);
      });
  }
  await prisma.log.create({
    data: {
      event: "linkAccount",
      email: user?.email || "",
      provider: account?.provider || "",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      createdAt: new Date(),
    },
  });
}
