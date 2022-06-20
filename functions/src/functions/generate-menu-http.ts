import { region, HttpsFunction } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { PubsubService } from '../services/pubsub.service';
import * as cors from 'cors';
import { ConfigurationService } from '../services/configuration.service';

@Service()
export class GenerateMenuHttpFunctionCreator extends FunctionCreator {
  private cors = cors({
    origin: ['https://generate-menu.web.app', 'https://generate-menu.firebaseapp.com'],
  });

  constructor(
    private readonly messagesService: PubsubService,
    private readonly configurationService: ConfigurationService,
  ) {
    super();
  }

  createFunction(): HttpsFunction {
    return region(this.configurationService.functionRegion).https.onRequest(
      async (request, response) =>
        this.cors(request, response, async () => {
          try {
            await this.messagesService.publish('generate-menu');

            response.status(200).send('Success!');
          } catch (e) {
            console.error(e);

            response.status(500).send('Error!');
          }
        }),
    );
  }
}
