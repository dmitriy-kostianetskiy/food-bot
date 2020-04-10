import * as admin from 'firebase-admin';
import createHttpsProxyAgent = require('https-proxy-agent');
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import * as firebaseSession from 'telegraf-session-firebase';

import { helloCommand, helpCommand, ingredientsCommand, menuCommand } from './commands';
import * as serviceAccount from './service-key.json';

export function bootstrap(bot: Telegraf<ContextMessageUpdate>): Telegraf<ContextMessageUpdate> {
  admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount><unknown>serviceAccount),
    databaseURL: 'https://food-bot-9fbfa.firebaseio.com'
  });

  const database = admin.database();

  bot.use(firebaseSession(database.ref('sessions')));
  bot.start(helloCommand);
  bot.help(helpCommand);

  bot.command('generate', menuCommand(true));
  bot.command('menu', menuCommand(false));
  bot.command('ingredients', ingredientsCommand);

  return bot;
}
