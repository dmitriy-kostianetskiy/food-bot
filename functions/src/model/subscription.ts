import { CartModel } from './cart/cart-model';
import { MenuModel } from './menu-model';
import { Language } from './translations';

export interface Subscription {
  readonly id: string;
  readonly menu: MenuModel;
  readonly cart: CartModel;
  readonly language: Language;
}
