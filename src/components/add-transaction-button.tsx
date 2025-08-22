"use client";

// import { useState } from "react";
// import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AddTransactionButton() {
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const t = useTranslations("dashboard");

  return (
    <div className="w-full">
      <Button
        //   onClick={() => setIsDialogOpen(true)}
        className="w-full md:w-auto"
      >
        <PlusCircle className="h-4 w-4" />
        {t("addTransaction")}
      </Button>
      {/* <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      /> */}
    </div>
  );
}
