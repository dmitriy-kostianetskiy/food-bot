import { Service } from 'typedi';
import { PubsubService } from './pubsub.service';
import { TelegramService } from './telegram.service';

@Service()
export class BotService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly pubsubService: PubsubService,
  ) {}

  // TODO: refactor
  configureCommands(): void {
    this.telegramService.telegraf.start(async (context) => {
      this.pubsubService.publish('subscriptions', {
        id: context.chat.id.toFixed(0),
        action: 'add',
      });
    });

    this.telegramService.telegraf.command('stop', async (context) => {
      this.pubsubService.publish('subscriptions', {
        id: context.chat.id.toFixed(0),
        action: 'remove',
      });
    });

    this.telegramService.telegraf.catch((error, context) => {
      console.log(`Ooops, encountered an error for ${context.updateType}`, error);
    });

    this.telegramService.telegraf.on('text', (context) =>
      context.reply(
        'Используйте команды /start и /stop, чтобы подписаться и отписаться от рассылки.',
      ),
    );
  }
}
