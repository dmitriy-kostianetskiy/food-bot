import { HttpsFunction, https } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { TelegramService } from '../services/telegram.service';
import { PubsubService } from '../services/pubsub.service';
import { TranslationService } from '../services/translation.service';

@Service()
export class TelegramBotHookFunctionCreator extends FunctionCreator {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly translationService: TranslationService,
    private readonly pubsubService: PubsubService,
  ) {
    super();

    this.configureCommands();
  }

  createFunction(): HttpsFunction {
    return https.onRequest(async (request, response) => {
      try {
        console.log('Incoming request', JSON.stringify(request.body));

        await this.telegramService.handleRequest(request.body, response);
      } finally {
        response.status(200).send();
      }
    });
  }

  private configureCommands() {
    this.telegramService.telegraf.use((context) => {
      context.language = this.translationService.findLanguageByCode(
        context.message?.from.language_code,
      );
    });

    this.telegramService.telegraf.start(async (context) => {
      this.pubsubService.publish('create-subscription', {
        id: context.chat.id.toFixed(0),
        language: context.language || 'en',
      });
    });

    this.telegramService.telegraf.command('stop', async (context) => {
      this.pubsubService.publish('remove-subscription', {
        id: context.chat.id.toFixed(0),
      });
    });

    this.telegramService.telegraf.catch((error, context) => {
      console.log(`Ooops, encountered an error for ${context.updateType}`, error);
    });

    this.telegramService.telegraf.on('text', (context) => {
      const text = this.translationService.get('useStartCommandToStart');

      context.reply(text);
    });
  }
}
