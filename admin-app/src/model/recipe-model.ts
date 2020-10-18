import { IngredientModel } from './ingredient-model'

export type MealKind = 'beef' | 'pork' | 'poultry' | 'vegetarian';

export interface RecipeModel {
  main: MealModel;
  side?: MealModel;
  readyIn?: string;
  mealKind?: MealKind;
};

export interface MealModel {
  title: string;
  steps: string[];
  ingredients: IngredientModel[];
}
