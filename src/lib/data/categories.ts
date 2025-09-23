import { Category } from "@/lib/types/settings";

// Dati hardcodati delle categorie di sistema
// In futuro questi verranno caricati dal database
export const systemCategories: Category[] = [
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

// Funzioni simulate per il database
// Queste funzioni simulano operazioni del DB e possono essere facilmente sostituite
export const getCategoriesFromDB = async (): Promise<Category[]> => {
  // Simula una chiamata al database con un delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In futuro sarà sostituito con una vera query al DB
  // es: return await prisma.category.findMany({ include: { subcategories: true } });
  return [...systemCategories];
};

export const addSubcategoryToDB = async (
  categoryId: string,
  subcategoryData: { name: string },
): Promise<Category[]> => {
  // Simula una chiamata al database
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Per ora aggiorna i dati in memoria
  // In futuro sarà sostituito con:
  // await prisma.subcategory.create({ data: { ...subcategoryData, categoryId } });
  // return await getCategoriesFromDB();

  const newSubcategory = {
    id: `${categoryId}-${Date.now()}`,
    name: subcategoryData.name,
    parentId: categoryId,
    isCustom: true,
  };

  const updatedCategories = systemCategories.map((cat) => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        subcategories: [...cat.subcategories, newSubcategory],
      };
    }
    return cat;
  });

  return updatedCategories;
};

export const deleteSubcategoryFromDB = async (
  categoryId: string,
  subcategoryId: string,
): Promise<Category[]> => {
  // Simula una chiamata al database
  await new Promise((resolve) => setTimeout(resolve, 50));

  // In futuro sarà sostituito con:
  // await prisma.subcategory.delete({ where: { id: subcategoryId } });
  // return await getCategoriesFromDB();

  const updatedCategories = systemCategories.map((cat) => {
    if (cat.id === categoryId) {
      return {
        ...cat,
        subcategories: cat.subcategories.filter(
          (sub) => sub.id !== subcategoryId,
        ),
      };
    }
    return cat;
  });

  return updatedCategories;
};
