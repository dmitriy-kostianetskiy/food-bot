import { HttpsFunction, region } from 'firebase-functions';

import BotService from '../services/bot.service';
import { DEFAULT_REGION } from '../constants';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';

@Service()
export default class TelegramBotHookFunctionCreator extends FunctionCreator {
  constructor (
    private botService: BotService
  ) {
    super();
  }

  createFunction(): HttpsFunction {
    return region(DEFAULT_REGION)
      .https
      .onRequest(async (request, response) => {
        try {
          console.log('Incoming request', JSON.stringify(request.body));
    
          await this.botService.bot.handleUpdate(request.body, response);
        } finally {
          response.status(200).send();
        }
      });
  }
}
