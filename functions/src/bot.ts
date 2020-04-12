import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { db } from './db';
import { Subscriber, Menu } from './model'

export function createBot(token: string): Telegraf<ContextMessageUpdate> {
  const bot = new Telegraf(token);

  bot.start(async (context) => {
    const chatId = context.chat.id.toFixed(0);
    const subscriber: Subscriber  = {
      id: chatId
    };

    await db.collection('/subscribers').doc(chatId).set(subscriber);

    await context.reply('Спасибо! Мы скоро перешлем вам меню.');
  });
  
  bot.command('stop', async (context) => {
    const chatId = context.chat.id.toFixed(0);
    await db.collection('/subscribers').doc(chatId).delete();

    await context.reply('Нам очень жаль, что вы нас покидаете :(');
  });

  bot.on('text', context => context.reply('Используйте команды /start и /stop, чтобы подписаться и отписаться от рассылки.'));

  return bot;
}
