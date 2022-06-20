import { CloudFunction, region } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { MenuGeneratorService } from '../services/menu-generator.service';
import { MenuService } from '../services/menu.service';
import { Service } from 'typedi';
import { ConfigurationService } from '../services/configuration.service';

@Service()
export class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuGenerator: MenuGeneratorService,
    private readonly menuService: MenuService,
    private readonly configurationService: ConfigurationService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return region(this.configurationService.functionRegion)
      .pubsub.topic('generate-menu')
      .onPublish(async () => {
        const menu = await this.menuGenerator.generate();

        await this.menuService.replaceCurrentMenu(menu);
      });
  }
}
