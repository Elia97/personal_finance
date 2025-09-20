import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import type { NavigationItem } from "@/types/navigation";
import { getTranslations } from "next-intl/server";
import { requireActiveStatus } from "@/lib/auth-utils";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const paramsList = await params;
  const locale = paramsList.locale;
  await requireActiveStatus(locale);
  const t = await getTranslations("dashboard.sidebar");

  const navItems: NavigationItem[] = [
    { title: t("menu.dashboard"), href: "/dashboard", icon: "home" },
    { title: t("menu.accounts"), href: "/dashboard/accounts", icon: "wallet" },
    {
      title: t("menu.transactions"),
      href: "/dashboard/transactions",
      icon: "arrow-left-right",
    },
    {
      title: t("menu.analytics"),
      href: "/dashboard/analytics",
      icon: "bar-chart-3",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header for desktop, hidden on mobile */}
      <NavigationHeader navItems={navItems} />

      {/* Main content with padding for mobile bottom nav */}
      <main className="pb-16 md:pb-0">
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>

      {/* Bottom navigation for mobile, hidden on desktop */}
      <BottomNavigation navItems={navItems} />
    </div>
  );
}
