"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Target,
  Tag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
  type: "entrata" | "uscita";
  isSystem: boolean;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  isCustom?: boolean;
}

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

interface NewSubcategory {
  name: string;
  parentId: string;
}

interface NewGoal {
  name: string;
  target: string;
  deadline: string;
}

const systemCategories: Category[] = [
  {
    id: "casa",
    name: "Casa",
    color: "#8884d8",
    type: "uscita",
    isSystem: true,
    subcategories: [
      { id: "casa-affitto", name: "Affitto", parentId: "casa" },
      { id: "casa-mutuo", name: "Mutuo", parentId: "casa" },
      { id: "casa-manutenzione", name: "Manutenzione", parentId: "casa" },
    ],
  },
  {
    id: "alimentari",
    name: "Alimentari",
    color: "#82ca9d",
    type: "uscita",
    isSystem: true,
    subcategories: [
      {
        id: "alimentari-supermercato",
        name: "Supermercato",
        parentId: "alimentari",
      },
      {
        id: "alimentari-ristoranti",
        name: "Ristoranti",
        parentId: "alimentari",
      },
    ],
  },
  {
    id: "trasporti",
    name: "Trasporti",
    color: "#ffc658",
    type: "uscita",
    isSystem: true,
    subcategories: [
      { id: "trasporti-carburante", name: "Carburante", parentId: "trasporti" },
      { id: "trasporti-mezzi", name: "Mezzi Pubblici", parentId: "trasporti" },
    ],
  },
  {
    id: "svago",
    name: "Svago",
    color: "#ff7300",
    type: "uscita",
    isSystem: true,
    subcategories: [
      { id: "svago-cinema", name: "Cinema", parentId: "svago" },
      { id: "svago-sport", name: "Sport", parentId: "svago" },
    ],
  },
  {
    id: "utenze",
    name: "Utenze",
    color: "#00ff88",
    type: "uscita",
    isSystem: true,
    subcategories: [
      { id: "utenze-luce", name: "Luce", parentId: "utenze" },
      { id: "utenze-gas", name: "Gas", parentId: "utenze" },
      { id: "utenze-internet", name: "Internet", parentId: "utenze" },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#ff0088",
    type: "uscita",
    isSystem: true,
    subcategories: [
      {
        id: "shopping-abbigliamento",
        name: "Abbigliamento",
        parentId: "shopping",
      },
      { id: "shopping-elettronica", name: "Elettronica", parentId: "shopping" },
    ],
  },
  {
    id: "stipendio",
    name: "Stipendio",
    color: "#22c55e",
    type: "entrata",
    isSystem: true,
    subcategories: [
      { id: "stipendio-base", name: "Stipendio Base", parentId: "stipendio" },
      { id: "stipendio-bonus", name: "Bonus", parentId: "stipendio" },
    ],
  },
  {
    id: "freelance",
    name: "Freelance",
    color: "#3b82f6",
    type: "entrata",
    isSystem: true,
    subcategories: [
      { id: "freelance-consulenza", name: "Consulenza", parentId: "freelance" },
      { id: "freelance-progetti", name: "Progetti", parentId: "freelance" },
    ],
  },
];

const initialGoals: Goal[] = [
  {
    id: 1,
    name: "Vacanze Estate",
    target: 3000,
    current: 1850,
    deadline: "2024-07-01",
  },
  {
    id: 2,
    name: "Fondo Emergenza",
    target: 10000,
    current: 6500,
    deadline: "2024-12-31",
  },
  {
    id: 3,
    name: "Nuovo Laptop",
    target: 1500,
    current: 1200,
    deadline: "2024-06-15",
  },
  {
    id: 4,
    name: "Auto Nuova",
    target: 15000,
    current: 4200,
    deadline: "2025-03-01",
  },
];

export default function SettingsPage() {
  const [categories, setCategories] = useState<Category[]>(systemCategories);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newSubcategory, setNewSubcategory] = useState<NewSubcategory>({
    name: "",
    parentId: "",
  });
  const [newGoal, setNewGoal] = useState<NewGoal>({
    name: "",
    target: "",
    deadline: "",
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const addSubcategory = useCallback(() => {
    if (newSubcategory.name.trim() && newSubcategory.parentId) {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === newSubcategory.parentId) {
            return {
              ...cat,
              subcategories: [
                ...cat.subcategories,
                {
                  id: `${cat.id}-${Date.now()}`,
                  name: newSubcategory.name,
                  parentId: cat.id,
                  isCustom: true,
                },
              ],
            };
          }
          return cat;
        }),
      );
      setNewSubcategory({ name: "", parentId: "" });
    }
  }, [newSubcategory]);

  const deleteSubcategory = useCallback(
    (categoryId: string, subcategoryId: string) => {
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              subcategories: cat.subcategories.filter(
                (sub) => sub.id !== subcategoryId,
              ),
            };
          }
          return cat;
        }),
      );
    },
    [],
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const addGoal = useCallback(() => {
    if (newGoal.name.trim() && newGoal.target && newGoal.deadline) {
      setGoals((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newGoal.name,
          target: Number.parseInt(newGoal.target),
          current: 0,
          deadline: newGoal.deadline,
        },
      ]);
      setNewGoal({ name: "", target: "", deadline: "" });
    }
  }, [newGoal]);

  const deleteGoal = useCallback((id: number) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application settings
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Gestione Categorie
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Le categorie principali sono fisse. Puoi aggiungere sottocategorie
              personalizzate.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="border rounded-lg">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.name}</span>
                      <Badge
                        variant={
                          category.type === "entrata" ? "default" : "secondary"
                        }
                      >
                        {category.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Sistema
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {category.subcategories.length} sottocategorie
                    </span>
                  </div>

                  {expandedCategories.has(category.id) && (
                    <div className="border-t bg-muted/20 p-3 space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="flex items-center justify-between pl-6 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{subcategory.name}</span>
                            {subcategory.isCustom && (
                              <Badge variant="outline" className="text-xs">
                                Personalizzata
                              </Badge>
                            )}
                          </div>
                          {subcategory.isCustom && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                deleteSubcategory(category.id, subcategory.id)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Sottocategoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuova Sottocategoria</DialogTitle>
                  <DialogDescription>
                    Aggiungi una sottocategoria personalizzata a una categoria
                    di sistema esistente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="parent-category">
                      Categoria Principale
                    </Label>
                    <Select
                      value={newSubcategory.parentId}
                      onValueChange={(value) =>
                        setNewSubcategory((prev) => ({
                          ...prev,
                          parentId: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona categoria principale" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name} ({cat.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory-name">
                      Nome Sottocategoria
                    </Label>
                    <Input
                      id="subcategory-name"
                      value={newSubcategory.name}
                      onChange={(e) =>
                        setNewSubcategory((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Es. Ristoranti Etnici"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addSubcategory}>
                    Aggiungi Sottocategoria
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Goals Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Obiettivi di Risparmio
            </CardTitle>
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
                    Scadenza:{" "}
                    {new Date(goal.deadline).toLocaleDateString("it-IT")}
                  </div>
                </div>
              ))}
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">
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
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={addGoal}>Crea Obiettivo</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
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
    </div>
  );
}
