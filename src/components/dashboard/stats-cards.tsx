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

const stats = [
  {
    title: "Average Monthly Savings",
    value: formatCurrency(averageMonthlySavings),
    note: "+12% from last month",
    icon: TrendingUpDown,
    color: "text-green-600",
  },
  {
    title: "Current Streak",
    value: `${currentStreak} months`,
    note: "No extra expenses",
    icon: Zap,
    color: "text-sky-600",
  },
  {
    title: "Current Level",
    value: currentLevel,
    note: "Next: Platinum",
    icon: Trophy,
    color: "text-yellow-600",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="hover:scale-[1.01] transition-transform duration-300 gap-0"
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
