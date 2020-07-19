import * as functions from 'firebase-functions';

import { Service } from 'typedi';
import { SubscriptionService } from './subscription.service';
import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';

@Service()
export default class BotService {
  readonly bot: Telegraf<TelegrafContext>;

  constructor (private subscriptionService: SubscriptionService) {
    this.bot = this.createBot();
  }

  private createBot(): Telegraf<TelegrafContext> {
    const bot = new Telegraf(functions.config().bot.key);

    bot.start(async (context) => {
      const chatId = context.chat.id.toFixed(0);

      await this.subscriptionService.addSubscription({
        id: chatId
      });

      await context.reply('Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽');
    });
    
    bot.command('stop', async (context) => {
      const chatId = context.chat.id.toFixed(0);
      
      await this.subscriptionService.deleteSubscription(chatId);

      await context.reply('Нам очень жаль, что Вы нас покидаете 😿');
    });

    bot.catch((error, context) => {
      console.log(`Ooops, encountered an error for ${context.updateType}`, error);
    });

    bot.on('text', context => context.reply('Используйте команды /start и /stop, чтобы подписаться и отписаться от рассылки.'));

    return bot;
  }
}

