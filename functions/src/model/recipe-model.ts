import { IngredientModel } from './ingredient-model';

export interface RecipeModel {
  id: string;
  main: MealModel;
  side?: MealModel;
  readyIn?: string;
}

export interface MealModel {
  title: string;
  steps: string[];
  ingredients: IngredientModel[];
}
