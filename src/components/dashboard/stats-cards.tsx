import { TrendingUpDown, Zap, Trophy } from "lucide-react";
import {
  averageMonthlySavings,
  currentStreak,
  currentLevel,
} from "@/lib/dashboard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "../ui/card";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export default async function StatsCards() {
  const t = await getTranslations("app.dashboard.statsCards");

  const stats = [
    {
      title: t("averageMonthlySavings.title"),
      value: formatCurrency(averageMonthlySavings),
      note: t("averageMonthlySavings.note"),
      icon: TrendingUpDown,
      color: "text-green-600",
    },
    {
      title: t("currentStreak.title"),
      value: `${currentStreak} ${t("currentStreak.months")}`,
      note: t("currentStreak.note"),
      icon: Zap,
      color: "text-sky-600",
    },
    {
      title: t("currentLevel.title"),
      value: t(`currentLevel.levels.${currentLevel}`),
      note: t("currentLevel.note"),
      icon: Trophy,
      color: "text-yellow-600",
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-transparent border-transparent shadow-none gap-0"
        >
          <CardHeader className="inline-flex justify-between items-center mb-6">
            <CardTitle className="text-sm sm:text-base font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stat.value}</CardContent>
          <CardFooter className="pt-0">
            <CardDescription className="text-xs">{stat.note}</CardDescription>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
