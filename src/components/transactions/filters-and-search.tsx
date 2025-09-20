"use client";

import { Search, Download } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useTransactions } from "@/contexts/transactions-context";

export default function FiltersAndSearch() {
  const { searchTerm, setSearchTerm, filterType, setFilterType } =
    useTransactions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtri e Ricerca</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca transazioni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtra per tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              <SelectItem value="income">Entrate</SelectItem>
              <SelectItem value="expense">Uscite</SelectItem>
              <SelectItem value="transfer">Trasferimenti</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            Esporta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
