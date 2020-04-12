export interface Recipe {
  readonly title?: string;
  readonly ingredients: Ingredient[];
  readonly steps: string[];
}

export interface Ingredient {
  readonly name: string;
  readonly amount?: number;
  readonly unit?: string;
  readonly indexes?: number[];
}

export interface Meal {
  readonly readyInTime?: string;
  readonly recipes: Recipe[];
}

export interface Menu {
  readonly meals: Meal[];
}
