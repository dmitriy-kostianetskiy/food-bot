import { Service } from 'typedi';
import { SubscriptionService } from './subscription.service';
import { Telegraf, Context } from 'telegraf';
import { Update } from 'typegram';
import { ServerResponse } from 'http';
import { ConfigurationService } from './configuration.service';

@Service()
export default class BotService {
  private readonly bot?: Telegraf<Context>;

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly configurationService: ConfigurationService
  ) {
    this.bot = this.createTelegraf(
      this.configurationService.botToken,
      this.configurationService.functionRegion
    );

    if (this.bot) {
      this.configureBot(this.bot);
    }
  }

  async handleRequest(body: Update, response: ServerResponse): Promise<void> {
    if (this.validateBot()) {
      await this.bot.handleUpdate(body, response);
    }
  }

  async sendHtml(subscriberId: string, html: string): Promise<void> {
    if (this.validateBot()) {
      await this.bot.telegram.sendMessage(subscriberId, html, { parse_mode: 'HTML' });
    }
  }

  private validateBot(): boolean {
    if (!this.bot) {
      console.log('Can not perform action because bot is not configured');
    }

    return !!this.bot;
  }

  private createTelegraf(token: string, region: string): Telegraf<Context> | undefined {
    if (!token) {
      console.error('Unable to run bot because bot token is empty');

      return undefined;
    }

    const bot = new Telegraf(token);
    bot.telegram.setWebhook(`https://${region}-generate-menu.cloudfunctions.net/telegramBotHook`);

    return bot;
  }

  private configureBot(bot: Telegraf<Context>): Telegraf<Context> {
    bot.start(async (context) => {
      const chatId = context.chat.id.toFixed(0);

      await this.subscriptionService.addSubscription({
        id: chatId,
      });

      await context.reply(
        'Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽'
      );
    });

    bot.command('stop', async (context) => {
      const chatId = context.chat.id.toFixed(0);

      await this.subscriptionService.deleteSubscription(chatId);

      await context.reply('Нам очень жаль, что Вы нас покидаете 😿');
    });

    bot.catch((error, context) => {
      console.log(
        `Ooops, encountered an error for ${context.updateType}`,
        error
      );
    });

    bot.on('text', (context) =>
      context.reply(
        'Используйте команды /start и /stop, чтобы подписаться и отписаться от рассылки.'
      )
    );

    return bot;
  }
}
