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
import { Plus, Trash2, Tag, ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "@/lib/types/settings";
import {
  addSubcategoryAction,
  deleteSubcategoryAction,
} from "@/app/actions/settings-actions";
import { useRouter } from "next/navigation";

interface NewSubcategory {
  name: string;
  parentId: string;
}

interface CategoriesManagementProps {
  categories: Category[];
}

export default function CategoriesManagement({
  categories,
}: CategoriesManagementProps) {
  const router = useRouter();
  const [newSubcategory, setNewSubcategory] = useState<NewSubcategory>({
    name: "",
    parentId: "",
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSubcategory = useCallback(async () => {
    if (!newSubcategory.name.trim() || !newSubcategory.parentId) {
      setError("Nome e categoria principale sono obbligatori");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("categoryId", newSubcategory.parentId);
      formData.append("name", newSubcategory.name);

      const result = await addSubcategoryAction(formData);

      if (result.error) {
        setError(result.error);
      } else {
        setNewSubcategory({ name: "", parentId: "" });
        router.refresh(); // Aggiorna i dati della pagina
      }
    } catch (err) {
      setError("Errore nell'aggiunta della sottocategoria");
      console.error("Error adding subcategory:", err);
    } finally {
      setLoading(false);
    }
  }, [newSubcategory, router]);

  const deleteSubcategory = useCallback(
    async (categoryId: string, subcategoryId: string) => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("categoryId", categoryId);
        formData.append("subcategoryId", subcategoryId);

        const result = await deleteSubcategoryAction(formData);

        if (result.error) {
          setError(result.error);
        } else {
          router.refresh(); // Aggiorna i dati della pagina
        }
      } catch (err) {
        setError("Errore nella cancellazione della sottocategoria");
        console.error("Error deleting subcategory:", err);
      } finally {
        setLoading(false);
      }
    },
    [router],
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

  return (
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
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
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
                          disabled={loading}
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
            <Button className="w-full" disabled={loading}>
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Sottocategoria
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuova Sottocategoria</DialogTitle>
              <DialogDescription>
                Aggiungi una sottocategoria personalizzata a una categoria di
                sistema esistente
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parent-category">Categoria Principale</Label>
                <Select
                  value={newSubcategory.parentId}
                  onValueChange={(value) =>
                    setNewSubcategory((prev) => ({
                      ...prev,
                      parentId: value,
                    }))
                  }
                  disabled={loading}
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
                <Label htmlFor="subcategory-name">Nome Sottocategoria</Label>
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
                  disabled={loading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addSubcategory} disabled={loading}>
                {loading ? "Aggiungendo..." : "Aggiungi Sottocategoria"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
