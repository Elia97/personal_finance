import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Trova l'utente
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Non rivelare se l'email esiste o no per sicurezza
      return NextResponse.json({
        message: "If the email exists, a reset link has been sent.",
      });
    }

    // Genera token con prefisso per reset
    const resetToken = "reset_" + crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 ora

    // Salva in VerificationToken
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: resetToken,
        expires,
      },
    });

    // Invia email
    const resetUrl = `${process.env.NEXTAUTH_URL}/${user.language}/auth/reset-password?token=${resetToken}`;
    await sendEmail(
      email,
      "Reset Your Password",
      `Click here to reset your password: ${resetUrl}`
    );

    return NextResponse.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
