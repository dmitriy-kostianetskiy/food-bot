import { TelegramCustomContext } from './custom-context';

export interface TelegramCommand<Context = TelegramCustomContext> {
  get command(): string;

  handler(context: Context): Promise<void>;
}
