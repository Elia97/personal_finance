import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userLanguage = token?.language;
  const pathnameParts = request.nextUrl.pathname.split("/");
  const currentLocale = pathnameParts[1];

  // If user has a preferred language and it's different from current locale, redirect
  if (
    userLanguage &&
    userLanguage !== currentLocale &&
    routing.locales.includes(userLanguage as "en" | "it") &&
    routing.locales.includes(currentLocale as "en" | "it")
  ) {
    const newUrl = new URL(request.nextUrl);
    const remainingPath =
      request.nextUrl.pathname.replace(`/${currentLocale}`, "") || "/";
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
