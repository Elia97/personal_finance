import { PlusCircle, MinusCircle, Target, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { getTranslations } from "next-intl/server";

export default async function QuickActions() {
  const t = await getTranslations("app.dashboard.quickActions");

  return (
    <Card>
      <CardHeader className="justify-center">
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 *:cursor-pointer">
        <Button
          variant="ghost"
          className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-sm">{t("addTransaction")}</span>
        </Button>
        <Button
          variant="ghost"
          className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
        >
          <MinusCircle className="h-6 w-6" />
          <span className="text-sm">{t("newBudget")}</span>
        </Button>
        <Button
          variant="ghost"
          className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
        >
          <Target className="h-6 w-6" />
          <span className="text-sm">{t("newGoal")}</span>
        </Button>
        <Button
          variant="ghost"
          className="h-10 sm:h-20 flex sm:flex-col items-center justify-center"
        >
          <Coins className="h-6 w-6" />
          <span className="text-sm">{t("investments")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
