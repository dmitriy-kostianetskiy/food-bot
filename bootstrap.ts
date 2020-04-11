import Telegraf, { ContextMessageUpdate } from 'telegraf';

import { helpCommand, ingredientsCommand, menuCommand } from './commands';

export function bootstrap(bot: Telegraf<ContextMessageUpdate>): Telegraf<ContextMessageUpdate> {

  bot.start(menuCommand(true));
  bot.help(helpCommand);

  bot.command('generate', menuCommand(true));
  bot.command('menu', menuCommand(false));
  bot.command('ingredients', ingredientsCommand);

  return bot;
}
