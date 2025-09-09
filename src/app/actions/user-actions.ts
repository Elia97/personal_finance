"use server";

import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-utils";

export async function getUserLocale(): Promise<{
  language: string | null;
  country: string | null;
}> {
  const session = await getAuthSession();

  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { language: true, country: true },
  });

  return {
    language: user?.language || null,
    country: user?.country || null,
  };
}

export async function getUserProfile() {
  const session = await getAuthSession();

  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
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
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
