import { HttpsFunction } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { TelegramService } from '../services/telegram.service';
import { topicFunction } from '../utils';

@Service()
export class TelegramSendMessageFunctionCreator extends FunctionCreator {
  constructor(private readonly telegramService: TelegramService) {
    super();
  }

  createFunction(): HttpsFunction {
    return topicFunction('telegram-bot-messages', async (message) => {
      for (const item of message.messages) {
        await this.telegramService.sendHtml(message.chatId, item);
      }
    });
  }
}
