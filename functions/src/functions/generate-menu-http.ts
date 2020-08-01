import { region, HttpsFunction } from 'firebase-functions';

import { DEFAULT_REGION } from '../constants';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { PubsubService } from '../services/pubsub.service';

@Service()
export default class GenerateMenuHttpFunctionCreator extends FunctionCreator {
  constructor (private messagesService: PubsubService) {
    super();
  }

  createFunction(): HttpsFunction {
    return region(DEFAULT_REGION)
      .https
      .onRequest(async (request, response) => {
        try {
          await this.messagesService.publish('generate-menu');

          response.status(200).send();
        } catch (e) {
          console.error(e);

          response.status(500).send();
        }
      });
  }
}
