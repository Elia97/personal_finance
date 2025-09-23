"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DataManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestione Dati</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline">Esporta Dati</Button>
          <Button variant="outline">Importa Dati</Button>
          <Button variant="destructive">Reset Applicazione</Button>
        </div>
      </CardContent>
    </Card>
  );
}
