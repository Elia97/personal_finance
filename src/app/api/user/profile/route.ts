import { authOptions } from "@/lib/auth";
import { jwt } from "@/lib/auth-callbacks";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT request", error); // Log errore
    return NextResponse.json(
      { error: "Error updating profile" },
      { status: 500 },
    );
  }
}
