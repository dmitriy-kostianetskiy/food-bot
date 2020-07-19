import { HttpsFunction, region } from 'firebase-functions';

import { BotMessage } from '../services/pubsub.service';
import BotService from '../services/bot.service';
import { DEFAULT_REGION } from '../constants';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';

@Service()
export default class TelegramSendMessageFunctionCreator extends FunctionCreator {
  constructor (private botService: BotService) {
    super();
  }

  createFunction(): HttpsFunction {
    return region(DEFAULT_REGION)
    .pubsub
    .topic('bot-messages')
    .onPublish(async (message) => {
      const jsonMessage = message.json as BotMessage;
  
      if (!jsonMessage?.messages || !jsonMessage?.subscriberId) {
        return;
      }
    
      for (const item of jsonMessage.messages) {
        await this.botService.bot.telegram.sendMessage(jsonMessage.subscriberId, item, { parse_mode: 'HTML' });
      }
    })
  }
}
