import { Context } from 'telegraf';
import { Language } from './translations';

export interface CustomContext extends Context {
  language?: Language;
}
