"use server";

import prisma from "@/lib/prisma";
import { getAuthSession, verifyPassword, hashPassword } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";

export async function changePasswordAction(formData: FormData) {
  const t = await getTranslations("auth.changePassword.form.errors");
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return { error: t("user") };
  }

  const oldPassword = formData.get("old-password") as string;
  const newPassword = formData.get("new-password") as string;

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
