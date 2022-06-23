import { HttpsFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { TelegramService } from '../services/telegram.service';
import { BotMessagingTopicMessage } from '../model';

@Service()
export class TelegramSendMessageFunctionCreator extends FunctionCreator {
  constructor(private readonly telegramService: TelegramService) {
    super();
  }

  createFunction(): HttpsFunction {
    return pubsub.topic('telegram-bot-messages').onPublish(async (message) => {
      const jsonMessage = message.json as BotMessagingTopicMessage;

      if (!jsonMessage?.messages || !jsonMessage?.chatId) {
        return;
      }

      for (const item of jsonMessage.messages) {
        await this.telegramService.sendHtml(jsonMessage.chatId, item);
      }
    });
  }
}
