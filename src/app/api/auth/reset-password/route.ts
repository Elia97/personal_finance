import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Verifica se il token inizia con 'reset_'
    if (!token.startsWith("reset_")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Trova il token in VerificationToken
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { error: "Token expired or invalid" },
        { status: 400 }
      );
    }

    // Trova l'utente
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash della nuova password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Aggiorna la password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Elimina il token usato
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
