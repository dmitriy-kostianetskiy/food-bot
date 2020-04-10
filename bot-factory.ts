import { bootstrap } from './bootstrap';

import { Agent } from 'https';
import createHttpsProxyAgent = require('https-proxy-agent');
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import {
  BOT_TOKEN,
  FUNCTION_TARGET,
  NODE_ENV
} from './environment';

export function createBot(): Telegraf<ContextMessageUpdate> {
  if (NODE_ENV === 'production') {
    return createProdBot();
  } else {
    return createLocalBot();
  }
}

function createLocalBot(): Telegraf<ContextMessageUpdate> {
  const bot = new Telegraf(BOT_TOKEN, {
    telegram: {
      agent: <Agent><unknown>createHttpsProxyAgent('http://127.0.0.1:9080')
    }
  });

  bootstrap(bot);

  bot.launch();

  return bot;
}

function createProdBot(): Telegraf<ContextMessageUpdate> {
  const bot = new Telegraf(BOT_TOKEN);
  bootstrap(bot);

  bot.telegram.setWebhook(`https://europe-west1-fleet-respect-241714.cloudfunctions.net/${FUNCTION_TARGET}`);

  return bot;
}
