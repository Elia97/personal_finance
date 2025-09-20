"use client";

import { savingsGoals } from "@/lib/analytics";
import { Progress } from "../ui/progress";
import { Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export default function SavingsGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Obiettivi di Risparmio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsGoals.map((goal, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{goal.name}</h4>
                <Badge variant="outline">{goal.progress}%</Badge>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>€{goal.current.toLocaleString()}</span>
                <span>€{goal.target.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Mancano €{(goal.target - goal.current).toLocaleString()} per
                raggiungere l&apos;obiettivo
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
