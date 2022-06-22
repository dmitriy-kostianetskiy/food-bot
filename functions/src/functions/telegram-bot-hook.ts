import { HttpsFunction, https } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { TelegramService } from '../services/telegram.service';

@Service()
export class TelegramBotHookFunctionCreator extends FunctionCreator {
  constructor(private readonly telegramService: TelegramService) {
    super();
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
}
