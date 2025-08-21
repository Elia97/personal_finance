import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Proteggi solo le rotte dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) {
      // Redirect a /auth/signin se non autenticato
      const signInUrl = new URL("/auth/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
}

// Configura le rotte da proteggere
export const config = {
  matcher: ["/dashboard/:path*"],
};
