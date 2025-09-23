"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Target } from "lucide-react";
import { Goal } from "@/lib/types/settings";
import {
  createGoalAction,
  deleteGoalAction,
} from "@/app/actions/settings-actions";
import { useRouter } from "next/navigation";

interface NewGoal {
  name: string;
  target: string;
  deadline: string;
}

export default function GoalsManagement({ goals }: { goals: Goal[] }) {
  const router = useRouter();
  const [newGoal, setNewGoal] = useState<NewGoal>({
    name: "",
    target: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGoal = useCallback(async () => {
    if (!newGoal.name.trim() || !newGoal.target || !newGoal.deadline) {
      setError("Tutti i campi sono obbligatori");
      return;
    }

    const targetValue = Number.parseInt(newGoal.target);
    if (isNaN(targetValue) || targetValue <= 0) {
      setError("L'importo target deve essere un numero maggiore di zero");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", newGoal.name);
      formData.append("target", newGoal.target);
      formData.append("deadline", newGoal.deadline);

      const result = await createGoalAction(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setNewGoal({ name: "", target: "", deadline: "" });
        router.refresh(); // Aggiorna i dati della pagina
      }
    } catch (err) {
      setError("Errore nella creazione dell'obiettivo");
      console.error("Error creating goal:", err);
    } finally {
      setLoading(false);
    }
  }, [newGoal, router]);

  const deleteGoal = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("goalId", id.toString());

        const result = await deleteGoalAction(formData);

        if (result.error) {
          setError(result.error);
        } else {
          router.refresh(); // Aggiorna i dati della pagina
        }
      } catch (err) {
        setError("Errore nella cancellazione dell'obiettivo");
        console.error("Error deleting goal:", err);
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Obiettivi di Risparmio
        </CardTitle>
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {goals.map((goal) => (
            <div key={goal.id} className="p-3 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{goal.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    onClick={() => deleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                €{goal.current.toLocaleString()} / €
                {goal.target.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Scadenza: {new Date(goal.deadline).toLocaleDateString("it-IT")}
              </div>
            </div>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Obiettivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuovo Obiettivo</DialogTitle>
              <DialogDescription>
                Crea un nuovo obiettivo di risparmio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="goal-name">Nome Obiettivo</Label>
                <Input
                  id="goal-name"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Es. Vacanze in Giappone"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="goal-target">Importo Target (€)</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      target: e.target.value,
                    }))
                  }
                  placeholder="5000"
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="goal-deadline">Data Scadenza</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal((prev) => ({
                      ...prev,
                      deadline: e.target.value,
                    }))
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addGoal} disabled={loading}>
                {loading ? "Creando..." : "Crea Obiettivo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
