import { TelegramCustomContext } from './custom-context';

export type TelegramErrorMiddleware<Context = TelegramCustomContext> = (
  error: unknown,
  context: Context,
) => Promise<void> | void;
