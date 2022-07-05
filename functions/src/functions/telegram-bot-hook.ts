import * as functions from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import Container, { Service } from 'typedi';
import { TelegramService } from '../services/telegram.service';
import { TranslationService } from '../services/translation.service';
import { COMMANDS_TOKEN } from '../tokens';
import { HttpsFunction } from 'firebase-functions';

@Service()
export class TelegramBotHookFunctionCreator extends FunctionCreator {
  private isConfigured = false;

  constructor(
    private readonly telegramService: TelegramService,
    private readonly translationService: TranslationService,
  ) {
    super();
  }

  createFunction(): HttpsFunction {
    return functions
      .runWith({ secrets: ['TELEGRAM_BOT_TOKEN'] })
      .region('europe-west1')
      .https.onRequest(async (request, response) => {
        try {
          this.configure();

          console.log('Incoming request', JSON.stringify(request.body));

          await this.telegramService.handleRequest(request.body, response);
        } finally {
          response.status(200).send();
        }
      });
  }

  private configure() {
    if (this.isConfigured) {
      return;
    }

    this.configureTelegram();

    this.isConfigured = true;
  }

  private configureTelegram(): void {
    this.configureChatIdMiddleware();
    this.configureLanguageMiddleware();
    this.configureCommands();
    this.configureErrorHandling();
    this.configureOnTextMiddleware();
  }

  private configureCommands(): void {
    const commands = Container.getMany(COMMANDS_TOKEN);

    this.telegramService.command(...commands);
  }

  private configureChatIdMiddleware(): void {
    this.telegramService.use(async (context, next) => {
      if (context.chat) {
        context.chatId = context.chat.id.toFixed(0);

        console.log(`ChatId: ${context.chatId}`);
      } else {
        console.log('No ChatId identified');
      }

      await next();
    });
  }

  private configureLanguageMiddleware(): void {
    this.telegramService.use(async (context, next) => {
      console.log('Extracting Language');

      const languageCode = context.message?.from.language_code;
      const language = this.translationService.findLanguageByCode(languageCode);

      context.language = language;

      console.log(`language_code: ${languageCode}, language: ${language}`);

      this.translationService.setLanguage(context.language);

      await next();
    });
  }

  private configureErrorHandling(): void {
    this.telegramService.catch((error, context) => {
      console.log(`Ooops, encountered an error for ${context.updateType}`, error);
    });
  }

  private configureOnTextMiddleware(): void {
    this.telegramService.text((context) => {
      const text = this.translationService.get('useStartCommandToStart', context.language);

      context.reply(text);
    });
  }
}
