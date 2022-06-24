import { CartCategory } from './cart-category';

export interface CartModel {
  readonly categories: readonly CartCategory[];
}
