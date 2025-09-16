"use server";

import {
  getAuthSession,
  verifyPassword,
  hashPassword,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "@/lib/auth-utils";
import { createUserEvent } from "@/lib/auth-events";
import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUser,
} from "@/app/repositories/user-repository";
import { randomBytes } from "crypto";
import {
  createVerificationToken,
  deleteVerificationToken,
  findVerificationToken,
} from "../repositories/auth-repository";

export async function signUpAction(formData: FormData) {
  const { name, email, password } = Object.fromEntries(formData.entries()) as {
    name: string;
    email: string;
    password: string;
  };

  const existingUser = await findUserByEmail(email);
  if (existingUser) return { error: "User with this email already exists." };
  const user = await createUser(name, email, password);
  if (user.email) {
    await createUserEvent({ user });
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 604800000); // 7 days from now
    await createVerificationToken(user.email, token, expires);
    await sendVerificationEmail(user.email, token);
    return { success: true };
  } else {
    return { error: "Error creating user." };
  }
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };
  const user = await findUserByEmail(email);
  if (user?.email) {
    const resetToken = "reset_" + randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now
    await createVerificationToken(user.email, resetToken, expires);
    await sendPasswordResetEmail(user.email, resetToken);
    return { success: true };
  } else {
    return { error: "No user found with this email." };
  }
}

export async function resetPasswordAction(formData: FormData) {
  const { token, newPassword } = Object.fromEntries(formData.entries()) as {
    token: string;
    newPassword: string;
  };
  if (!token || !newPassword) {
    return { error: "Token and new password are required." };
  }
  if (!token.startsWith("reset_")) {
    return { error: "Invalid token." };
  }
  try {
    const verificationToken = await findVerificationToken(token);
    if (!verificationToken || verificationToken.expires < new Date()) {
      return { error: "Invalid or expired token." };
    }

    const user = await findUserByEmail(verificationToken.identifier);
    if (!user) return { error: "User not found." };

    await updateUser(user.id, {
      password: await hashPassword(newPassword),
    }).catch(() => {
      return { error: "Error updating password." };
    });

    await deleteVerificationToken(token).catch(() => {
      return { error: "Error deleting token." };
    });

    return { success: true };
  } catch {
    return { error: "An error occurred while resetting the password." };
  }
}

export async function changePasswordAction(formData: FormData) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { error: "User is not authenticated." };
  }

  const { oldPassword, newPassword } = Object.fromEntries(
    formData.entries(),
  ) as {
    oldPassword: string;
    newPassword: string;
  };

  try {
    const user = await findUserById(session.user.id, {
      id: true,
      password: true,
    });

    if (!user) return { error: "User not found." };
    const isOldPasswordValid = await verifyPassword(
      oldPassword,
      user.password || "",
    );

    if (!isOldPasswordValid) return { error: "Invalid old password." };
    await updateUser(user.id, { password: await hashPassword(newPassword) });
    return { success: true };
  } catch (e: unknown) {
    return e instanceof Error
      ? { error: e.message }
      : { error: "An error occurred." };
  }
}
