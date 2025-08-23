import { Roboto } from "next/font/google";
import "../globals.css";
import { Providers } from "./providers";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body className={`${roboto.variable} antialiased`}>
        <main>
          <Providers>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </Providers>
        </main>
      </body>
    </html>
  );
}
