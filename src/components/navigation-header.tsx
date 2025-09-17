"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthButton from "@/components/auth-button";
import {
  Wallet,
  Home,
  ArrowLeftRight,
  BarChart3,
  LineChart,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavigationItem } from "@/types/navigation";

// Icon mapping
const iconMap = {
  home: Home,
  wallet: Wallet,
  "arrow-left-right": ArrowLeftRight,
  "bar-chart-3": BarChart3,
  "line-chart": LineChart,
  settings: Settings,
};

interface NavigationHeaderProps {
  navItems: NavigationItem[];
}

export function NavigationHeader({ navItems }: NavigationHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <span className="font-bold text-lg">Personal Finance</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {IconComponent ? <IconComponent className="h-4 w-4" /> : null}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth Button */}
        <div className="flex items-center">
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
