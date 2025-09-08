import { getAuthSession } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const data = await req.json();
    const { language, country } = data;
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        language,
        country,
      },
    });

    const token = await getToken({ req });
    if (token) {
      token.language = language;
      token.country = country;
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Errore aggiornamento profilo" },
      { status: 500 },
    );
  }
}
