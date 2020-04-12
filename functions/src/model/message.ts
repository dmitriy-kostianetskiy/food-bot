import { Subscription } from './subscription';
import { Menu } from './recipe';

export interface Message {
  readonly subscription: Subscription;
  readonly menu: Menu;
}
