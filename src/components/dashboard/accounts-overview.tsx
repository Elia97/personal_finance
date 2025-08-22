import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

const accounts = [
  {
    id: 1,
    name: "Checking Account",
    type: "CHECKING",
    balance: 1000,
  },
  {
    id: 2,
    name: "Savings Account",
    type: "SAVINGS",
    balance: 5000,
  },
  {
    id: 3,
    name: "Investments",
    type: "INVESTMENT",
    balance: 15000,
  },
];

export async function AccountsOverview() {
  const t = await getTranslations("dashboard.accounts");
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <div className="font-medium">{account.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {account.type === "CHECKING"
                      ? t("type.checking")
                      : account.type === "SAVINGS"
                      ? t("type.savings")
                      : t("type.investment")}
                  </div>
                </div>
                <div className="font-medium">{account.balance}</div>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div className="font-medium">{t("totalBalance")}</div>
              <div className="text-lg font-bold">
                {accounts.reduce((acc, account) => acc + account.balance, 0)}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            {t("emptyState")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
