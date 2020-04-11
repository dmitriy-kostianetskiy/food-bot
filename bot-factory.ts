import { bootstrap } from './bootstrap';

import { Agent } from 'https';
import createHttpsProxyAgent = require('https-proxy-agent');
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import * as admin from 'firebase-admin';
import * as firebaseSession from 'telegraf-session-firebase';

import * as serviceAccount from './service-key.json';

export const {
  BOT_TOKEN,
  NODE_ENV,
  FUNCTION_TARGET,
  FIREBASE_URL,
  FUNCTION_URL,
  PROXY
} = process.env;

export function createBot(): Telegraf<ContextMessageUpdate> {
  const options = {
    telegram: {
      agent: PROXY ? <Agent><unknown>createHttpsProxyAgent(PROXY) : null
    }
  };

  const bot = new Telegraf(BOT_TOKEN, options);

  admin.initializeApp({
    credential: admin.credential.cert(<admin.ServiceAccount><unknown>serviceAccount),
    databaseURL: FIREBASE_URL
  });

  const database = admin.database();

  bot.use(firebaseSession(database.ref('sessions')));

  bootstrap(bot);

  if (NODE_ENV === 'production') {
    bot.telegram.setWebhook(`${FUNCTION_URL}/${FUNCTION_TARGET}`);

  } else {
    bot.launch();
  }

  return bot;
}
