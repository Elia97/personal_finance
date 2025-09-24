import { NextResponse, NextRequest } from "next/server";
import {
  findVerificationToken,
  deleteVerificationToken,
} from "@/repositories/auth-repository";
import { findUserByEmail, updateUser } from "@/repositories/user-repository";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  const token = req.nextUrl.searchParams.get("token");

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing token" },
      { status: 400 },
    );
  }

  try {
    // Trova il token nel database usando il repository
    const verificationToken = await findVerificationToken(token);

    if (!verificationToken || verificationToken.expires < new Date()) {
      return NextResponse.json(
        { message: "Token invalid or expired" },
        { status: 404 },
      );
    }

    // Trova l'utente per email
    const userToUpdate = await findUserByEmail(verificationToken.identifier);
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Aggiorna l'utente usando il repository
    await updateUser(userToUpdate.id, {
      emailVerified: new Date(),
    });

    // Elimina il token dopo l'uso usando il repository
    await deleteVerificationToken(token);

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
