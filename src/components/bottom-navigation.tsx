"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, BarChart3, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

// Icon mapping
const iconMap = {
  home: Home,
  wallet: Wallet,
  "arrow-left-right": ArrowLeftRight,
  "bar-chart-3": BarChart3,
};

interface BottomNavigationProps {
  navItems: NavigationItem[];
}

export function BottomNavigation({ navItems }: BottomNavigationProps) {
  const pathname = usePathname();

  // Show only first 4 items
  const displayItems = navItems.slice(0, 4);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
      <div className="grid grid-cols-4 h-16 px-2">
        {displayItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = iconMap[item.icon as keyof typeof iconMap];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center px-1 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              <IconComponent
                className={cn("h-5 w-5 mb-1", isActive && "text-primary")}
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
