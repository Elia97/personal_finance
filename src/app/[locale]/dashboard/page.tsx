import { AccountsOverview } from "@/components/dashboard/accounts-overview";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { TransactionsSummary } from "@/components/dashboard/transactions-summary";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
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
