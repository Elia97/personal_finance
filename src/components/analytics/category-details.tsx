"use client";

import { categoryData, totalUscite } from "@/lib/analytics";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function CategoryDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dettaglio Categorie di Spesa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryData.map((category, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  €{category.value.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((category.value / totalUscite) * 100)}% del totale
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
