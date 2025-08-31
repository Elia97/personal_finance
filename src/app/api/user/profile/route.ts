import { authOptions } from "@/lib/auth";
import { jwt } from "@/lib/auth-callbacks"; // Importa direttamente il callback jwt
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
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
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error fetching profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    console.log("PUT request received"); // Log iniziale
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      console.error("Unauthorized: No session or user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Session validated", session.user.id); // Log sessione
    const body = await req.json();
    console.log("Request body", body); // Log del corpo della richiesta

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: body,
    });

    console.log("User updated successfully", updatedUser); // Log aggiornamento utente

    const updatedToken = await jwt({
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
    });

    console.log("Token updated successfully", updatedToken); // Log aggiornamento token

    return NextResponse.json(
      { user: updatedUser, token: updatedToken },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT request", error); // Log errore
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 }
    );
  }
}
