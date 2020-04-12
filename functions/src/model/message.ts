import { Subscriber } from './subscriber';
import { Menu } from './recipe';

export interface Message {
  subscriber: Subscriber;
  menu: Menu;
}
