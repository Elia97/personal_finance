"use client";

import {
  totalEntrate,
  mediaEntrate,
  totalUscite,
  mediaUscite,
  totalBilancio,
} from "@/lib/analytics";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entrate Totali</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            €{totalEntrate.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Media: €{Math.round(mediaEntrate).toLocaleString()}/mese
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uscite Totali</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            €{totalUscite.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Media: €{Math.round(mediaUscite).toLocaleString()}/mese
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Bilancio Annuale
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              totalBilancio >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalBilancio >= 0 ? "+" : ""}€{totalBilancio.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalBilancio >= 0 ? "Surplus" : "Deficit"} annuale
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasso Risparmio</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round((totalBilancio / totalEntrate) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">Del reddito totale</p>
        </CardContent>
      </Card>
    </div>
  );
}
