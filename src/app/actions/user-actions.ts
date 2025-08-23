"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserLocale(): Promise<{
  language: string | null;
  country: string | null;
}> {
  const session = await getServerSession(authOptions);

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
