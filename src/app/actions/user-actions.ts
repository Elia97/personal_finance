"use server";

import { getAuthSession } from "@/lib/auth-utils";
import { jwt } from "@/lib/auth-callbacks";
import { User, UserProfile } from "next-auth";
import { UserService, handleUserServiceError } from "@/lib/services/user";
import { revalidatePath } from "next/cache";

export async function getUserLocale(): Promise<Partial<User>> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  try {
    return await UserService.getUserLocale(session.user.id);
  } catch (error) {
    console.error("Error getting user locale:", error);
    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    throw new Error("User is not authenticated");
  }

  try {
    return await UserService.getUserProfile(session.user.id);
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

export async function onBoardingAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    const { country, language } = Object.fromEntries(formData.entries()) as {
      country: string;
      language: string;
    };

    await UserService.completeOnboarding(session.user.id, {
      country,
      language,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return {
      error: handleUserServiceError(error, "Error updating user profile."),
    };
  }
}

export async function updateProfileAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session || !session.user?.id) {
    return { error: "User is not authenticated." };
  }

  try {
    // Extract data from FormData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const dateOfBirth = formData.get("dateOfBirth") as string;
    const country = formData.get("country") as string;
    const language = formData.get("language") as string;

    // Handle settings
    const twoFactorEnabled =
      formData.get("settings.twoFactorEnabled") === "true";
    const notifications = formData.get("settings.notifications") === "true";
    const marketingEmail = formData.get("settings.marketingEmail") === "true";

    // Update user profile using service
    const updatedUser = await UserService.updateProfile(session.user.id, {
      name,
      email,
      phone,
      dateOfBirth,
      country,
      language,
      settings: {
        twoFactorEnabled,
        notifications,
        marketingEmail,
      },
    });

    // Update JWT token
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

    revalidatePath("/dashboard/profile");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      error: handleUserServiceError(error, "Error updating user profile."),
    };
  }
}
