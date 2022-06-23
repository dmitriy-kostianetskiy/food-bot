import { https, HttpsFunction } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import * as cors from 'cors';
import { MenuService } from '../services/menu.service';

@Service()
export class GenerateMenuHttpFunctionCreator extends FunctionCreator {
  private cors = cors({
    origin: ['https://generate-menu.web.app', 'https://generate-menu.firebaseapp.com'],
  });

  constructor(private readonly menuService: MenuService) {
    super();
  }

  createFunction(): HttpsFunction {
    return https.onRequest(async (request, response) =>
      this.cors(request, response, async () => {
        try {
          await this.menuService.generateNew();

          response.status(200).send('Success!');
        } catch (e) {
          console.error(e);

          response.status(500).send('Error!');
        }
      }),
    );
  }
}
