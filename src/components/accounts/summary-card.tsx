"use client";

import { EyeOff, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useAccounts } from "@/contexts/accounts-context";

export default function SummaryCard() {
  const { showBalances, setShowBalances, totalBalance, accounts } =
    useAccounts();

  return (
    <Card className="bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Riepilogo Conti</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBalances(!showBalances)}
          >
            {showBalances ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Patrimonio Totale
            </div>
            <div className="text-3xl font-bold">
              {showBalances
                ? `€${totalBalance.toLocaleString("it-IT")}`
                : "••••••"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Conti Attivi</div>
            <div className="text-3xl font-bold">{accounts.length}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              Ultimo Aggiornamento
            </div>
            <div className="text-lg font-semibold">Oggi</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
