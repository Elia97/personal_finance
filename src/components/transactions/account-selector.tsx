"use client";

import React from "react";
import { getAccountIcon } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useTransactions } from "@/contexts/transactions-context";

export default function AccountSelector() {
  const { accounts, selectedAccount, setSelectedAccount } = useTransactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleziona Conto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger title="Seleziona un conto" className="w-full">
                <SelectValue placeholder="Seleziona un conto" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem
                    key={account.id}
                    value={account.id?.toString() || ""}
                    className="py-3"
                  >
                    <div className="flex items-center gap-2 overflow-x-hidden">
                      {React.createElement(
                        getAccountIcon(account.type ?? "default"),
                      )}
                      <span className="text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                        {account.name} &mdash; {account.bank}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
