import { Subscription } from './subscription';
import { MenuModel } from './recipe';

export type MessageType = 'publishMenu' | 'sendMenu';

export interface GenerateMenuMessage {
  readonly type: 'generateMenu';
}

export interface SendMenuMessage {
  readonly type: 'sendMenu';
  readonly subscription: Subscription;
  readonly menu: MenuModel;
}

export type Message = SendMenuMessage | GenerateMenuMessage; 
