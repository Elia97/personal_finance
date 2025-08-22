import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/sidebar";
import {
  Home,
  ArrowLeftRight,
  BarChart3,
  LineChart,
  Settings,
  Wallet,
  MoveLeft,
} from "lucide-react";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth-utils";
import { redirect } from "@/i18n/navigation";

const navItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Accounts", href: "/accounts", icon: Wallet },
  { title: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Investments", href: "/investments", icon: LineChart },
  { title: "Settings", href: "/settings", icon: Settings },
];

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const paramsList = await params;
  const locale = paramsList.locale;
  const session = await getAuthSession();
  if (!session) {
    redirect({ href: "/auth/signin", locale });
  }
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Professional blue gradient background matching home page */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>

      {/* Geometric pattern overlay for depth */}
      <div className="fixed inset-0 opacity-15">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="dashboardGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#dashboardGrid)"
            className="text-blue-300"
          />
        </svg>
      </div>

      {/* Subtle floating elements for depth */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="fixed top-20 right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="fixed bottom-32 left-20 w-32 h-32 bg-indigo-400/8 rounded-full blur-2xl"></div>
        <div className="fixed top-1/2 right-1/4 w-24 h-24 bg-cyan-400/12 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10">
        <SidebarProvider>
          <Sidebar variant="floating" className="p-4">
            <SidebarHeader className="border-b flex flex-row justify-center p-4">
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
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full justify-start items-center gap-2"
                >
                  <MoveLeft className="size-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="flex-1 w-full relative bg-transparent">
            <div className="w-full p-4">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
