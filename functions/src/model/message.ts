import { Subscription } from './subscription';
import { MenuModel } from './recipe';

export interface Message {
  readonly subscription: Subscription;
  readonly menu: MenuModel;
}
