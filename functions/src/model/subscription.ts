import { MenuModel } from './menu-model';

export interface Subscription {
  readonly id: string;
  readonly menu: MenuModel;
  readonly printed: readonly string[];
}
