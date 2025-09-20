"use client";

import { monthlyData } from "@/lib/analytics";
import { BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyTrend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Andamento Mensile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`€${value}`, ""]} />
            <Bar dataKey="entrate" fill="#22c55e" name="Entrate" />
            <Bar dataKey="uscite" fill="#ef4444" name="Uscite" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
