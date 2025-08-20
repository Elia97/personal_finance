import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password obbligatorie" },
        { status: 400 }
      );
    }
    // Controlla se l'utente esiste già
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Utente già registrato" },
        { status: 409 }
      );
    }
    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Crea l'utente
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // puoi aggiungere altri campi di default qui
      },
    });
    return NextResponse.json(
      { success: true, user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Errore durante la registrazione" },
      { status: 500 }
    );
  }
}
