import { https, HttpsFunction } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { PubsubService } from '../services/pubsub.service';
import * as cors from 'cors';

@Service()
export class GenerateMenuHttpFunctionCreator extends FunctionCreator {
  private cors = cors({
    origin: ['https://generate-menu.web.app', 'https://generate-menu.firebaseapp.com'],
  });

  constructor(private readonly pubsubService: PubsubService) {
    super();
  }

  createFunction(): HttpsFunction {
    return https.onRequest(async (request, response) =>
      this.cors(request, response, async () => {
        try {
          await this.pubsubService.publish('generate-menu');

          response.status(200).send('Success!');
        } catch (e) {
          console.error(e);

          response.status(500).send('Error!');
        }
      }),
    );
  }
}
