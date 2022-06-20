import { IngredientModel } from './ingredient-model';

export interface RecipeModel {
  readonly id: string;
  readonly main: MealModel;
  readonly side?: MealModel;
  readonly readyIn?: string;
}

export interface MealModel {
  readonly title: string;
  readonly steps: readonly string[];
  readonly ingredients: readonly IngredientModel[];
}
