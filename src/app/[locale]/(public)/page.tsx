import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import CallToAction from "@/components/call-to-action";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function Home() {
  const t = await getTranslations("home");
  const title = t("title");
  const [left, right] = title.split("-").map((part) => part.trim());

  return (
    <>
      <section className="w-full flex flex-col items-center justify-center min-h-screen py-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-6 text-blue-100 drop-shadow-lg drop-shadow-primary/80">
          {left}
          {right && (
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              <br />
              {right}
            </span>
          )}
        </h1>
        <p className="text-lg md:text-2xl max-w-prose text-blue-100 mb-12 leading-relaxed">
          {t("description")}
        </p>
        <CallToAction />
      </section>
      <section id="features" className="h-screen"></section>
    </>
  );
}
