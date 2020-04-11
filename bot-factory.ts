
import { Agent } from 'https';
import createHttpsProxyAgent = require('https-proxy-agent');
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import * as admin from 'firebase-admin';
import * as firebaseSession from 'telegraf-session-firebase';

import { helpCommand, ingredientsCommand, menuCommand } from './commands';
import * as serviceAccount from './service-key.json';

export const {
  BOT_TOKEN,
  NODE_ENV,
  FUNCTION_TARGET,
  FIREBASE_URL,
  FUNCTION_URL,
  PROXY
} = process.env;

const commands = [
  { command: 'generate', handler: menuCommand(true), description: 'Сгенерировать новое меню на неделю' },
  { command: 'menu', handler: menuCommand(false), description: 'Показать текущее меню на неделю' },
  { command: 'ingredients', handler: ingredientsCommand, description: 'Показать список ингредиентов' }
];

export async function createBot(): Promise<Telegraf<ContextMessageUpdate>> {
  const options = {
    telegram: {
      agent: PROXY ? <Agent><unknown>createHttpsProxyAgent(PROXY) : null
    }
  };

  const bot = new Telegraf(BOT_TOKEN, options);

  await bootstrap(bot);

  if (NODE_ENV === 'production') {
    bot.telegram.setWebhook(`${FUNCTION_URL}/${FUNCTION_TARGET}`);
  } else {
    bot.launch();
  }

  return bot;
}

async function bootstrap(bot: Telegraf<ContextMessageUpdate>): Promise<void> {
  configureErrorHandling(bot);
  configureSession(bot);
  await configureCommands(bot);
  await setBotCommands(bot);
}

function configureErrorHandling(bot: Telegraf<ContextMessageUpdate>): void {
  bot.use(async (context, next) => {
    try {
      await next();
    } catch (error) {
      console.error('Unable to handle request', error);
    }
  });
}

function configureSession(bot: Telegraf<ContextMessageUpdate>): void {
  admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount><unknown>serviceAccount),
    databaseURL: FIREBASE_URL
  });

  const database = admin.database();

  bot.use(firebaseSession(database.ref('sessions'), {
    property: 'session',
    getSessionKey: (context: ContextMessageUpdate) => context.from && `${context.from.id}`
  }));
}

async function configureCommands(bot: Telegraf<ContextMessageUpdate>): Promise<void> {
  try {
    bot.start(menuCommand(true));
    bot.help(helpCommand);

    const botName = await getBotName(bot);
    commands.forEach(({ command, handler }) => {
      bot.command(command, handler);

      if (botName) {
        bot.command(`${command}@${botName}`, handler);
      }
    });
  } catch (error) {
    console.error('Unable to configure bot commands', error);
  }
}

async function setBotCommands(bot: Telegraf<ContextMessageUpdate>): Promise<void> {
  try {
    // tslint:disable-next-line: no-any
    await (<any>bot.telegram).setMyCommands(commands);
  } catch (error) {
    console.error('Unable to set bot commands', error);
  }
}

async function getBotName(bot: Telegraf<ContextMessageUpdate>): Promise<string> {
  try {
    const { username } = await bot.telegram.getMe();
    return username;
  } catch (error) {
    console.error('Unable to get bot name', error);

    return null;
  }
}
