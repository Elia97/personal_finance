"use client";

import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useTransactions } from "@/contexts/transactions-context";

export default function TransactionsList() {
  const { filteredTransactions } = useTransactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transazioni ({filteredTransactions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessuna transazione trovata per i filtri selezionati
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-600"
                        : transaction.type === "expense"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : transaction.type === "expense" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Badge className="text-xs">{transaction.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(transaction.date || "").toLocaleDateString(
                          "it-IT",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold text-lg ${
                      (transaction.amount ?? 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(transaction.amount ?? 0) >= 0 ? "+" : ""}€
                    {Math.abs(transaction.amount ?? 0).toLocaleString("it-IT")}
                  </div>
                  <Badge
                    variant={
                      transaction.type === "income"
                        ? "secondary"
                        : transaction.type === "expense"
                        ? "destructive"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {transaction.type === "income"
                      ? "Entrata"
                      : transaction.type === "expense"
                      ? "Uscita"
                      : "Trasferimento"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
