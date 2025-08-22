import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

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
      <section className="w-full flex flex-col items-center justify-center min-h-screen py-4">
        {/* Content with enhanced styling */}
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          {left}
          {right && (
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              <br />
              {right}
            </span>
          )}
        </h1>
        <p className="text-xl md:text-2xl max-w-prose text-blue-100 mb-12 leading-relaxed">
          {t("description")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3 text-lg font-semibold"
            >
              {t("getStarted")}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-300 text-blue-100 hover:bg-blue-800/20 hover:border-blue-200 px-8 py-3 text-lg font-semibold backdrop-blur-sm bg-transparent"
          >
            {t("discoverFeatures")}
          </Button>
        </div>
      </section>
      <section className="h-screen"></section>
    </>
  );
}
