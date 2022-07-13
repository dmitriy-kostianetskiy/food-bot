import { TelegramCustomContext } from './custom-context';

export type TelegramText<Context = TelegramCustomContext> = (
  context: Context,
) => Promise<void> | void;
