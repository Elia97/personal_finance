"use client";

import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useTransactions } from "@/contexts/transactions-context";

export default function SummaryStats() {
  const { totalIncome, totalExpenses } = useTransactions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entrate Totali</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            +€{totalIncome.toLocaleString("it-IT")}
          </div>
          <p className="text-xs text-muted-foreground">Questo mese</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uscite Totali</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            -€{totalExpenses.toLocaleString("it-IT")}
          </div>
          <p className="text-xs text-muted-foreground">Questo mese</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bilancio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              totalIncome - totalExpenses >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {totalIncome - totalExpenses >= 0 ? "+" : ""}€
            {(totalIncome - totalExpenses).toLocaleString("it-IT")}
          </div>
          <p className="text-xs text-muted-foreground">Differenza</p>
        </CardContent>
      </Card>
    </div>
  );
}
