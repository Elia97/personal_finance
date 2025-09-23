import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import type { NavigationItem } from "@/types/navigation";
import { getTranslations } from "next-intl/server";
import { requireActiveStatus } from "@/lib/auth-utils";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActiveStatus();
  const t = await getTranslations("app.dashboard.navBar");

  const navItems: NavigationItem[] = [
    { title: t("dashboard"), href: "/dashboard", icon: "home" },
    { title: t("accounts"), href: "/dashboard/accounts", icon: "wallet" },
    {
      title: t("transactions"),
      href: "/dashboard/transactions",
      icon: "arrow-left-right",
    },
    {
      title: t("analytics"),
      href: "/dashboard/analytics",
      icon: "bar-chart-3",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader navItems={navItems} />
      <main className="pb-16 md:pb-0">
        <div className="container mx-auto p-4 md:p-6">{children}</div>
      </main>
      <BottomNavigation navItems={navItems} />
    </div>
  );
}
