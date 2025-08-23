import AuthButton from "@/components/auth-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  ArrowLeftRight,
  BarChart3,
  LineChart,
  Settings,
  Wallet,
} from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { getTranslations } from "next-intl/server";
import BackgroundPrivate from "@/components/background-private";
import BackToHomeButton from "@/components/back-to-home-button";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const paramsList = await params;
  const locale = paramsList.locale;
  const session = await requireAuth(locale);
  if (session.user.status !== "ACTIVE") {
    return null;
  }

  const t = await getTranslations("dashboard.sidebar");

  const navItems = [
    { title: t("menu.dashboard"), href: "/", icon: Home },
    { title: t("menu.accounts"), href: "/accounts", icon: Wallet },
    {
      title: t("menu.transactions"),
      href: "/transactions",
      icon: ArrowLeftRight,
    },
    { title: t("menu.analytics"), href: "/analytics", icon: BarChart3 },
    { title: t("menu.investments"), href: "/investments", icon: LineChart },
    { title: t("menu.settings"), href: "/settings", icon: Settings },
  ];
  return (
    <BackgroundPrivate>
      <SidebarProvider>
        <Sidebar variant="floating" className="p-4">
          <SidebarHeader className="relative border-b flex flex-row justify-center p-4">
            <div className="absolute top-2 right-2 md:hidden">
              <SidebarTrigger />
            </div>
            <AuthButton />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="p-4 gap-2">
              {navItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    isActive={false}
                    tooltip={item.title}
                    className="px-4 py-6 cursor-pointer"
                  >
                    <div>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <BackToHomeButton />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset className="flex-1 w-full relative bg-transparent">
          <div className="w-full p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </BackgroundPrivate>
  );
}
