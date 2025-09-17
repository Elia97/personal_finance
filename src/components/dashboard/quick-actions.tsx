import { Zap, PlusCircle, MinusCircle, Target, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 *:cursor-pointer">
          <Button
            variant="ghost"
            className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
          >
            <PlusCircle className="h-6 w-6" />
            <span className="text-sm">Add Transaction</span>
          </Button>
          <Button
            variant="ghost"
            className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
          >
            <MinusCircle className="h-6 w-6" />
            <span className="text-sm">New Budget</span>
          </Button>
          <Button
            variant="ghost"
            className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
          >
            <Target className="h-6 w-6" />
            <span className="text-sm">New Goal</span>
          </Button>
          <Button
            variant="ghost"
            className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
          >
            <Coins className="h-6 w-6" />
            <span className="text-sm">Investments</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
