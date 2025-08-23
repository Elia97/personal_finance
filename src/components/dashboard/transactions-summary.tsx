import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import CurrentMonthLabel from "../current-month-label";
import { getAuthSession } from "@/lib/auth-utils";
import { getUserLocale } from "@/app/actions/user-actions";

export async function TransactionsSummary() {
  const session = await getAuthSession();
  if (session?.user.status !== "ACTIVE") return null;
  const { language, country } = await getUserLocale();
  const locale = `${language}-${country}`; // es: "en-US" o "it-IT"
  const summary = {
    income: 2450.75,
    expenses: 1780.2,
  };
  const t = await getTranslations("dashboard.summary");

  return (
    <Card className="col-span-2 lg:col-span-1 justify-between">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>{t("title")}</CardTitle>
        <div className="flex items-center">
          <CardDescription>
            <CurrentMonthLabel />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 ">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("income")}</span>
            <span className="font-medium text-green-600">
              {formatCurrency(summary.income, locale)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t("expenses")}</span>
            <span className="font-medium text-red-600">
              {formatCurrency(summary.expenses, locale)}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>{t("balance")}</span>
              <span
                className={
                  summary.income - summary.expenses >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {formatCurrency(summary.income - summary.expenses, locale)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {t("viewByMonth")}
        </span>
      </CardFooter>
    </Card>
  );
}
