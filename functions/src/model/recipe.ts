export interface Recipe {
  readonly title?: string;
  readonly ingredients: Ingredient[];
  readonly steps: string[];
}

export interface Ingredient {
  readonly name: string;
  readonly amount?: number;
  readonly unit?: string;
}

export interface Meal {
  readonly readyInTime?: string;
  readonly recipes: Recipe[];
}

export interface Menu {
  readonly meals: Meal[];
}

export interface Category {
  readonly name: string;
  readonly titles: string[];
}

export interface CartIngredient {
  name: string;
  byMeals: {
    index: number;
    amount: number;
    unit: string;
  }[];
}

export type Cart = _.Dictionary<CartIngredient[]>;
