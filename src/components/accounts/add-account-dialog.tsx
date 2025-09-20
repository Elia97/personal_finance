"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

import { Label } from "@radix-ui/react-label";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { DialogHeader, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { useAccounts } from "@/contexts/accounts-context";

export default function AddAccountDialog() {
  const { isAddAccountOpen, setIsAddAccountOpen } = useAccounts();

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">I Tuoi Conti</h2>
      <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Aggiungi Conto
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Conto</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo conto da aggiungere
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="account-name">Nome Conto</Label>
              <Input
                id="account-name"
                placeholder="Es. Conto Corrente Principale"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-type">Tipo Conto</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Conto Corrente</SelectItem>
                  <SelectItem value="savings">Conto Risparmio</SelectItem>
                  <SelectItem value="credit">Carta di Credito</SelectItem>
                  <SelectItem value="investment">Investimenti</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bank-name">Banca</Label>
              <Input id="bank-name" placeholder="Es. Intesa Sanpaolo" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="balance">Saldo Iniziale</Label>
              <Input id="balance" type="number" placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddAccountOpen(false)}
            >
              Annulla
            </Button>
            <Button onClick={() => setIsAddAccountOpen(false)}>
              Aggiungi Conto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
