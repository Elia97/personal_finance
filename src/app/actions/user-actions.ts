"use server";

import { getAuthSession } from "@/lib/auth-utils";
import { updateUser } from "../repositories/user-repository";
import type { Prisma } from "@/generated/prisma";
import { jwt } from "@/lib/auth-callbacks";
import { findUserById } from "@/app/repositories/user-repository";
import { User, UserProfile } from "next-auth";

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

export async function onBoardingAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }
  const { country, language } = Object.fromEntries(formData.entries()) as {
    country: string;
    language: string;
  };

  if (!country || !language) {
    return { error: "Country and language are required." };
  }

  await updateUser(session.user.id, {
    country,
    language,
  }).catch(() => {
    return { error: "Error updating user profile." };
  });

  return { success: true };
}

export async function updateProfileAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    // Estrai i dati dalla FormData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const country = formData.get("country") as string;
    const language = formData.get("language") as string;

    // Gestisci i settings
    const twoFactorEnabled =
      formData.get("settings.twoFactorEnabled") === "true";
    const notifications = formData.get("settings.notifications") === "true";
    const marketingEmail = formData.get("settings.marketingEmail") === "true";

    // Prepara i dati per l'aggiornamento
    const updateData: Prisma.UserUpdateInput = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
      ...(country && { country }),
      ...(language && { language }),
      settings: {
        twoFactorEnabled,
        notifications,
        marketingEmail,
      },
    };

    const updatedUser = await updateUser(session.user.id, updateData);

    if (!updatedUser) {
      return { error: "Error updating user profile." };
    }

    await jwt({
      token: {
        id: session.user.id,
        name: updatedUser.name,
        email: updatedUser.email,
        picture: updatedUser.image,
        role: updatedUser.role,
        status: updatedUser.status,
        language: updatedUser.language,
        country: updatedUser.country,
      },
      user: updatedUser,
      trigger: "update",
    }).catch(() => {
      return { error: "Error updating token." };
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Profile update error:", error);
    return { error: "Error updating user profile." };
  }
}
