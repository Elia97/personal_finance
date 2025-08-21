import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function TransactionsSummary() {
  // Hardcoded dummy data
  const currentMonthLabel = "August 2025";
  const summary = {
    income: 2450.75,
    expenses: 1780.2,
  };

  return (
    <Card className="col-span-2 lg:col-span-1 justify-between">
      <CardHeader className="flex flex-col items-center">
        <CardTitle>Monthly Summary</CardTitle>
        <div className="flex items-center">
          <CardDescription>{currentMonthLabel}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 ">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Income</span>
            <span className="font-medium text-green-600">
              {formatCurrency(summary.income)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expenses</span>
            <span className="font-medium text-red-600">
              {formatCurrency(summary.expenses)}
            </span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Balance</span>
              <span
                className={
                  summary.income - summary.expenses >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {formatCurrency(summary.income - summary.expenses)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          View summary by month
        </span>
      </CardFooter>
    </Card>
  );
}
