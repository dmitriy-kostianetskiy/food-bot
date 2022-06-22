import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { MenuGeneratorService } from '../services/menu-generator.service';
import { MenuService } from '../services/menu.service';
import { Service } from 'typedi';

@Service()
export class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuGenerator: MenuGeneratorService,
    private readonly menuService: MenuService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return pubsub.topic('generate-menu').onPublish(async () => {
      const menu = await this.menuGenerator.generate();

      await this.menuService.replaceCurrentMenu(menu);
    });
  }
}
