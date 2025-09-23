"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { Category, Goal } from "@/lib/types/settings";

// Dynamic imports for better performance
const CategoriesManagement = dynamic(
  () => import("./settings/categories-management"),
  {
    loading: () => <Loader2 className="animate-spin" />,
  },
);

const GoalsManagement = dynamic(() => import("./settings/goals-management"), {
  loading: () => <Loader2 className="animate-spin" />,
});

const DataManagement = dynamic(() => import("./settings/data-management"), {
  loading: () => <Loader2 className="animate-spin" />,
});

interface SettingsClientProps {
  initialCategories: Category[];
  initialGoals: Goal[];
}

export default function SettingsClient({
  initialCategories,
  initialGoals,
}: SettingsClientProps) {
  return (
    <div className="space-y-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your application settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoriesManagement categories={initialCategories} />
        <GoalsManagement goals={initialGoals} />
      </div>

      <DataManagement />
    </div>
  );
}
