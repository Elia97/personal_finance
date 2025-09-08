import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import crypto from "crypto";
import { getTranslations } from "next-intl/server";

export async function POST(request: NextRequest) {
  const t = await getTranslations("forgot-password");
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: t("emailRequired") }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: t("emailNotSent"),
      });
    }

    const resetToken = "reset_" + crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 ora

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/${user.language}/auth/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      t("resetEmail.subject"),
      t("resetEmail.body", { resetUrl })
    );

    return NextResponse.json({ message: t("emailSent") });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : t("serverError"),
      },
      { status: 500 }
    );
  }
}
