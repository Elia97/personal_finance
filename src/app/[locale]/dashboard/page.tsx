import AddTransactionButton from "@/components/add-transaction-button";
import { AccountsOverview } from "@/components/dashboard/accounts-overview";
import { TransactionsSummary } from "@/components/dashboard/transactions-summary";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { SidebarTrigger } from "@/components/ui/sidebar";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("dashboard");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  return (
    <div className="flex flex-col gap-6">
      <Card className="md:flex-row justify-between relative">
        <div className="absolute top-2 left-2 md:hidden">
          <SidebarTrigger />
        </div>
        <CardHeader className="text-center text-nowrap md:text-left">
          <h1 className="text-3xl font-bold">{t("header.title")}</h1>
          <p className="text-muted-foreground">{t("header.description")}</p>
        </CardHeader>
        <CardFooter>
          <AddTransactionButton />
        </CardFooter>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AccountsOverview />
        <TransactionsSummary />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-80"></Card>
        <Card className="h-80"></Card>
        <Card className="h-80"></Card>
      </div>
    </div>
  );
}
