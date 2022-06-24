import { CartCategoryIngredientItem } from './cart-category-ingredient-item';

export interface CartCategoryIngredient {
  readonly title: string;
  readonly mealIndexes: number[];
  readonly items: readonly CartCategoryIngredientItem[];
}
