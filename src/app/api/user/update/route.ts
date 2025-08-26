import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const data = await req.json();
    const { phone, language, country, dateOfBirth } = data;
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phone,
        language,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    });

    // Aggiorna i dati della sessione corrente
    const token = await getToken({ req });
    if (token) {
      token.phone = phone;
      token.language = language;
      token.country = country;
      token.dateOfBirth = dateOfBirth;
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Errore aggiornamento profilo" },
      { status: 500 }
    );
  }
}
