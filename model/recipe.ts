export interface Recipe {
  title?: string;
  ingredients: Ingredient[];
  steps: string[];
}

export interface Ingredient {
  name: string;
  amount?: number;
  unit?: string;
}

export interface Meal {
  readyInTime?: string;
  recipes: Recipe[];
}
