import { HttpsFunction, pubsub } from 'firebase-functions';

import { BotMessage } from '../services/pubsub.service';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { TelegramService } from '../services/telegram.service';

@Service()
export class TelegramSendMessageFunctionCreator extends FunctionCreator {
  constructor(private readonly telegramService: TelegramService) {
    super();
  }

  createFunction(): HttpsFunction {
    return pubsub.topic('bot-messages').onPublish(async (message) => {
      const jsonMessage = message.json as BotMessage;

      if (!jsonMessage?.messages || !jsonMessage?.subscriberId) {
        return;
      }

      for (const item of jsonMessage.messages) {
        await this.telegramService.sendHtml(jsonMessage.subscriberId, item);
      }
    });
  }
}
