import { Roboto } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

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
        <main className="flex flex-col items-center justify-center min-h-screen">
          <Providers>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </Providers>
        </main>
      </body>
    </html>
  );
}
