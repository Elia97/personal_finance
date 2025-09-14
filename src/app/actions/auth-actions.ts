"use server";

import prisma from "@/lib/prisma";
import {
  getAuthSession,
  verifyPassword,
  hashPassword,
  createVerificationToken,
  sendVerificationEmail,
} from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";
import { createUserEvent } from "@/lib/auth-events";

export async function signUpAction(formData: FormData) {
  const { name, email, password } = Object.fromEntries(formData.entries()) as {
    name: string;
    email: string;
    password: string;
  };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) return { error: "User with this email already exists." };

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  if (user.email) {
    await createUserEvent({ user });
    const token = await createVerificationToken(user.email);
    await sendVerificationEmail(user.email, token);
    return { success: true };
  } else {
    return { error: "Error creating user." };
  }
}

export async function changePasswordAction(formData: FormData) {
  const t = await getTranslations("auth.changePassword.form.errors");
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { error: t("user") };
  }

  const { oldPassword, newPassword } = Object.fromEntries(
    formData.entries(),
  ) as {
    oldPassword: string;
    newPassword: string;
  };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) throw new Error("User not found");

    const isOldPasswordValid = await verifyPassword(
      oldPassword,
      user.password || "",
    );
    if (!isOldPasswordValid) throw new Error("Invalid old password");

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    return { success: true };
  } catch (e: unknown) {
    return e instanceof Error ? { error: e.message } : { error: t("generic") };
  }
}
