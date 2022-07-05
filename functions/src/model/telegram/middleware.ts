import { TelegramCustomContext } from './custom-context';

type Next = () => Promise<void>;

export type TelegramMiddleware<Context = TelegramCustomContext> = (
  context: Context,
  next: Next,
) => Promise<void> | void;
