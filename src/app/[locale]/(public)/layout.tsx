import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import BackgroundPublic from "@/components/background-public";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    keywords: [
      t("keywords.personalFinance"),
      t("keywords.moneyManagement"),
      t("keywords.budget"),
      t("keywords.investments"),
      t("keywords.savings"),
      t("keywords.financialPlanning"),
    ],
    authors: [{ name: t("authors.team") }],
    creator: t("creator"),
    publisher: t("publisher"),
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: t("openGraph.locale"),
      title: t("title"),
      description: t("description"),
      siteName: t("openGraph.siteName"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BackgroundPublic>{children}</BackgroundPublic>;
}
