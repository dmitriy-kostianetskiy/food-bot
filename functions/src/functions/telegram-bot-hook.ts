import { HttpsFunction, region } from 'firebase-functions';

import BotService from '../services/bot.service';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { ConfigurationService } from '../services/configuration.service';

@Service()
export class TelegramBotHookFunctionCreator extends FunctionCreator {
  constructor (
    private readonly botService: BotService,
    private readonly configurationService: ConfigurationService
  ) {
    super();
  }

  createFunction(): HttpsFunction {
    return region(this.configurationService.functionRegion)
      .https
      .onRequest(async (request, response) => {
        try {
          console.log('Incoming request', JSON.stringify(request.body));

          await this.botService.handleRequest(request.body, response);
        } finally {
          response.status(200).send();
        }
      });
  }
}
