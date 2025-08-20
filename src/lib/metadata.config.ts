import type { Metadata } from "next";

export function generateMetadata(page: string): Metadata {
  const titles: Record<string, string> = {
    app: "Personal Finance - Manage Your Finances",
    signin: "Sign In - Personal Finance",
    dashboard: "Dashboard - Personal Finance",
    default: "Personal Finance App",
  };

  const descriptions: Record<string, string> = {
    app: "Professional platform for personal finance management. Monitor, plan and optimize your financial resources.",
    signin: "Access your personal financial management platform.",
    dashboard: "Complete dashboard for controlling your personal finances.",
    default: "Professional app for personal finance management.",
  };

  return {
    title: titles[page] ?? titles.default,
    description: descriptions[page] ?? descriptions.default,
    keywords: [
      "personal finance",
      "money management",
      "budget",
      "investments",
      "savings",
      "financial planning",
    ],
    authors: [{ name: "Personal Finance Team" }],
    creator: "Personal Finance App",
    publisher: "Personal Finance",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: titles[page] ?? titles.default,
      description: descriptions[page] ?? descriptions.default,
      siteName: "Personal Finance",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[page] ?? titles.default,
      description: descriptions[page] ?? descriptions.default,
    },
  };
}
