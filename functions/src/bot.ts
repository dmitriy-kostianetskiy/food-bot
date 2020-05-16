import Telegraf from 'telegraf';
import { SubscriptionService } from './services';
import { TelegrafContext } from 'telegraf/typings/context';

export function configureBot(
  bot: Telegraf<TelegrafContext>,
  subscriptionService: SubscriptionService
): Telegraf<TelegrafContext> {
  bot.start(async (context) => {
    const chatId = context.chat.id.toFixed(0);

    await subscriptionService.addSubscription({
      id: chatId
    });

    await context.reply('Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽');
  });
  
  bot.command('stop', async (context) => {
    const chatId = context.chat.id.toFixed(0);
    
    await subscriptionService.deleteSubscription(chatId);

    await context.reply('Нам очень жаль, что Вы нас покидаете 😿');
  });

  bot.catch((error, context) => {
    console.log(`Ooops, encountered an error for ${context.updateType}`, error);
  });

  bot.on('text', context => context.reply('Используйте команды /start и /stop, чтобы подписаться и отписаться от рассылки.'));

  return bot;
}
