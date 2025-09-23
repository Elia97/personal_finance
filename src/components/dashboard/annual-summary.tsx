import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  currentMonth,
  financialProgress,
  getHealthStatus,
  monthlyBalance,
  monthlyExpenses,
  monthlyIncome,
  savingRate,
  totalBalance,
  totalExpenses,
  totalIncome,
} from "@/lib/dashboard";
import { getTranslations } from "next-intl/server";

export default async function AnnualSummary() {
  const healthStatus = getHealthStatus();
  const t = await getTranslations("app.dashboard.annualSummary");

  return (
    <Card className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border-primary/20">
      <CardHeader className="text-center">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl bg-primary/20">
              {healthStatus.emoji}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>
              {t("title")} - {new Date().getFullYear()}
            </CardTitle>
            <p className="text-muted-foreground">
              {t(`healthStatus.${healthStatus.status}`)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{t("progress")}</span>
            <span>
              €{totalExpenses.toLocaleString("it-IT")} / €
              {totalIncome.toLocaleString("it-IT")}
            </span>
          </div>
          <Progress
            value={financialProgress}
            className="h-4 bg-green-500 [&>div]:bg-red-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-sm">
            <div>
              <div className="text-muted-foreground">{t("totalIncome")}</div>
              <div className="font-bold text-green-600">
                €{totalIncome.toLocaleString("it-IT")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">{t("totalExpenses")}</div>
              <div className="font-bold text-red-600">
                €{totalExpenses.toLocaleString("it-IT")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">{t("annualBalance")}</div>
              <div
                className={`font-bold ${
                  totalBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                €{totalBalance.toLocaleString("it-IT")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">{t("savingRate")}</div>
              <div
                className={`font-bold ${
                  totalBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {savingRate.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* Current Month Summary */}
        <div className="border-t border-primary/30 pt-4 w-full">
          <h3 className="text-lg font-semibold mb-3 text-center">
            {t("monthlySummary.title")} -{" "}
            {t(`monthlySummary.months.${currentMonth.toLowerCase()}`)}
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">
                {t("monthlySummary.income")}
              </div>
              <div className="text-2xl font-bold text-green-600">
                €{monthlyIncome.toLocaleString("it-IT")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {t("monthlySummary.expenses")}
              </div>
              <div className="text-2xl font-bold text-red-600">
                €{monthlyExpenses.toLocaleString("it-IT")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {t("monthlySummary.balance")}
              </div>
              <div
                className={`text-2xl font-bold ${
                  monthlyBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                €{monthlyBalance.toLocaleString("it-IT")}
              </div>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
