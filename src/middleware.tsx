import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const cookieStore = await cookies();
  let userLanguage = cookieStore.get("user-language")?.value || token?.language;

  // Se non abbiamo una lingua dalle preferenze utente/cookie, usa quella del browser
  if (!userLanguage) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    // Estrai la prima lingua preferita del browser
    const browserLang = acceptLanguage.split(",")[0]?.split("-")[0];
    // Se la lingua del browser è supportata, usala, altrimenti usa il default
    userLanguage = routing.locales.includes(browserLang as "en" | "it")
      ? browserLang
      : routing.defaultLocale;
  }

  const pathnameParts = request.nextUrl.pathname.split("/");
  const currentLocale = pathnameParts[1]; // If user has a preferred language and it's different from current locale, redirect
  if (
    userLanguage &&
    userLanguage !== currentLocale &&
    routing.locales.includes(userLanguage as "en" | "it") &&
    routing.locales.includes(currentLocale as "en" | "it") &&
    !request.nextUrl.pathname.startsWith(`/${userLanguage}`)
  ) {
    let remainingPath = request.nextUrl.pathname.replace(/^\/(en|it)/, "");
    // Remove any additional locales
    while (remainingPath.match(/^\/(en|it)/)) {
      remainingPath = remainingPath.replace(/^\/(en|it)/, "");
    }
    if (!remainingPath.startsWith("/")) remainingPath = "/" + remainingPath;
    const newUrl = new URL(request.nextUrl);
    newUrl.pathname = `/${userLanguage}${remainingPath}`;
    return NextResponse.redirect(newUrl);
  }

  // Use next-intl middleware for other cases
  return createMiddleware(routing)(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
