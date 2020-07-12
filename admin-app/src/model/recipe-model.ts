import { IngredientModel } from "./ingredient-model";

export interface RecipeModel {
  title: string;
  readyIn: number;
  steps: string[];
  ingredients: IngredientModel[];
};
