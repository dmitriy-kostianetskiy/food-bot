import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { MenuService } from '../services/menu.service';

@Service()
export class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor(private readonly menuService: MenuService) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return pubsub.topic('generate-menu').onPublish(async () => {
      await this.menuService.generateNew();
    });
  }
}
