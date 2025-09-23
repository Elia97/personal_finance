export interface Category {
  id: string;
  name: string;
  color: string;
  type: "entrata" | "uscita";
  isSystem: boolean;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  parentId: string;
  isCustom?: boolean;
}

export interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface CreateSubcategoryData {
  name: string;
  parentId: string;
}

export interface CreateGoalData {
  name: string;
  target: number;
  deadline: string;
}

export interface UpdateGoalData {
  id: number;
  name?: string;
  target?: number;
  current?: number;
  deadline?: string;
}
