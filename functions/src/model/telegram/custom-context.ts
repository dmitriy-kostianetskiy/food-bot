import { Context } from 'telegraf';
import { Language } from '../translations';

export interface TelegramCustomContext extends Context {
  language: Language;
  chatId: string;
}
