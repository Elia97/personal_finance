import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function AnnualSummary() {
  const healthStatus = getHealthStatus();

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl bg-primary/20">
              {healthStatus.emoji}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Annual Summary 2024</CardTitle>
            <p className="text-muted-foreground">{healthStatus.message}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Annual Financial Progress</span>
            <span>
              €{totalExpenses.toLocaleString("en-US")} / €
              {totalIncome.toLocaleString("en-US")}
            </span>
          </div>
          <Progress
            value={financialProgress}
            className="h-4 bg-green-500 [&>div]:bg-red-500"
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 text-center text-sm">
            <div>
              <div className="text-muted-foreground">Total Income</div>
              <div className="font-bold text-green-600">
                €{totalIncome.toLocaleString("en-US")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Expenses</div>
              <div className="font-bold text-red-600">
                €{totalExpenses.toLocaleString("en-US")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Annual Balance</div>
              <div
                className={`font-bold ${
                  totalBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                €{totalBalance.toLocaleString("en-US")}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Saving Rate</div>
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

        {/* Current Month Summary */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 text-center">
            {currentMonth} Summary
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Income</div>
              <div className="text-2xl font-bold text-green-600">
                €{monthlyIncome.toLocaleString("en-US")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Expenses</div>
              <div className="text-2xl font-bold text-red-600">
                €{monthlyExpenses.toLocaleString("en-US")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Balance</div>
              <div
                className={`text-2xl font-bold ${
                  monthlyBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                €{monthlyBalance.toLocaleString("en-US")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
