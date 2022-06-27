import { CartModel } from './cart/cart-model';
import { MenuModel } from './menu-model';

export interface Subscription {
  readonly id: string;
  readonly menu: MenuModel;
  readonly cart: CartModel;
  readonly printed: readonly string[];
}
