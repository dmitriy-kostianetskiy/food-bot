export interface RecipeModel {
  readonly title?: string;
  readonly ingredients: IngredientModel[];
  readonly steps: string[];
}

export interface IngredientModel {
  readonly name: string;
  readonly amount?: number;
  readonly unit?: string;
}

export interface MealModel {
  readonly readyInTime?: string;
  readonly recipes: RecipeModel[];
}

export interface MenuModel {
  readonly meals: MealModel[];
}

export interface CategoryModel {
  readonly name: string;
  readonly titles: string[];
}
