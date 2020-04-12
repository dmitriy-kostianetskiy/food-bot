import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { SubscriptionService } from './services';

export function configureBot(
  bot: Telegraf<ContextMessageUpdate>,
  subscriptionService: SubscriptionService
): Telegraf<ContextMessageUpdate> {
  bot.start(async (context) => {
    const chatId = context.chat.id.toFixed(0);

    await subscriptionService.addSubscription({
      id: chatId
    });

    await context.reply('Спасибо! Мы скоро перешлем вам меню.');
  });
  
  bot.command('stop', async (context) => {
    const chatId = context.chat.id.toFixed(0);
    
    await subscriptionService.deleteSubscription(chatId);

    await context.reply('Нам очень жаль, что вы нас покидаете :(');
  });

  bot.on('text', context => context.reply('Используйте команды /start и /stop, чтобы подписаться и отписаться от рассылки.'));

  return bot;
}
