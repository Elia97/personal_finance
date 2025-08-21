"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Card, CardFooter, CardHeader } from "../ui/card";
// import { useState } from "react";
// import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";

export function DashboardHeader() {
  //   const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card className="md:flex-row justify-between">
      <CardHeader className="text-center text-nowrap md:text-left">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your personal finances
        </p>
      </CardHeader>

      <CardFooter>
        <div className="w-full">
          <Button
            //   onClick={() => setIsDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </CardFooter>
      {/* <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      /> */}
    </Card>
  );
}
