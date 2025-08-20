import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 401,
      });
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
    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Errore aggiornamento profilo" }),
      { status: 500 }
    );
  }
}
