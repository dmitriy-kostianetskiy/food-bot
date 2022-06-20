import { HttpsFunction, region } from 'firebase-functions';

import { BotMessage } from '../services/pubsub.service';
import BotService from '../services/bot.service';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { ConfigurationService  } from '../services/configuration.service';

@Service()
export class TelegramSendMessageFunctionCreator extends FunctionCreator {
  constructor (
    private readonly botService: BotService,
    private readonly configurationService: ConfigurationService) {
    super();
  }

  createFunction(): HttpsFunction {
    return region(this.configurationService.functionRegion)
      .pubsub
      .topic('bot-messages')
      .onPublish(async (message) => {
        const jsonMessage = message.json as BotMessage;

        if (!jsonMessage?.messages || !jsonMessage?.subscriberId) {
          return;
        }

        for (const item of jsonMessage.messages) {
          await this.botService.sendHtml(jsonMessage.subscriberId, item);
        }
      });
  }
}
