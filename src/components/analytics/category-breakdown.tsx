"use client";

import { categoryData } from "@/lib/analytics";
import { PieChartIcon } from "lucide-react";
import { ResponsiveContainer, Pie, Cell, Tooltip, PieChart } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function CategoryBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Spese per Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={(props) => {
                const { name, percent } = props as {
                  name?: string;
                  percent?: number;
                };
                if (typeof name === "string" && typeof percent === "number") {
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }
                return name ?? "";
              }}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`€${value}`, "Spesa"]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
