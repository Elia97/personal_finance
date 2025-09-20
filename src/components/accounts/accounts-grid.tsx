"use client";

import { getAccountIcon, getAccountTypeLabel } from "@/lib/utils";
import { Badge } from "../ui/badge";
import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { useAccounts } from "@/contexts/accounts-context";

export default function AccountsGrid() {
  const { accounts, setPrimaryAccount, showBalances } = useAccounts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <Card
          key={account.id}
          className="relative hover:shadow-md transition-shadow"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {account.isPrimary && (
              <Badge
                variant="secondary"
                className="text-xs absolute -top-2 -right-2"
              >
                Principale
              </Badge>
            )}
            <div className="flex items-center gap-4">
              {React.createElement(getAccountIcon(account.type))}
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{account.bank}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">
                Saldo Disponibile
              </div>
              <div
                className={`text-2xl font-bold ${
                  account.balance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {showBalances
                  ? `€${account.balance.toLocaleString("it-IT")}`
                  : "••••••"}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Badge variant="outline">
                {getAccountTypeLabel(account.type)}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {account.accountNumber}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Ultimo movimento:{" "}
              {new Date(account.lastTransaction).toLocaleDateString("it-IT")}
            </div>
          </CardContent>
          <CardFooter className="gap-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 bg-transparent"
            >
              Dettagli
            </Button>
            {!account.isPrimary && (
              <Button
                size="sm"
                variant="secondary"
                className="flex-1"
                onClick={() => setPrimaryAccount(account.id)}
              >
                Imposta Principale
              </Button>
            )}
            {account.isPrimary && (
              <Button size="sm" className="flex-1">
                Movimenti
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
