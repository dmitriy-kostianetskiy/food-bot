import { CartCategoryIngredient } from './cart-category-ingredient';

export interface CartCategory {
  readonly title: string;
  readonly items: readonly CartCategoryIngredient[];
}
