import { CloudFunction, region } from 'firebase-functions';

import { CategoryService } from '../services/category.service';
import { FunctionCreator } from './function-creator';
import { Menu } from '../menu';
import { MenuService } from '../services/menu.service';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';
import { Subscription } from '../model';
import { ConfigurationService } from '../services/configuration.service';

@Service()
export class PublishMenuToSubscriberFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly pubsubService: PubsubService,
    private readonly configurationService: ConfigurationService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return region(this.configurationService.functionRegion)
      .firestore.document(`${this.configurationService.subscriptionsPath}/{subscribersId}`)
      .onCreate(async (snapshot) => {
        const subscription = snapshot.data() as Subscription;

        if (!subscription?.id) {
          return;
        }

        const [menuModel, categories] = await Promise.all([
          this.menuService.fetchCurrentMenu(),
          this.categoryService.fetchAll(),
        ]);

        const menu = new Menu(menuModel, categories);

        await this.pubsubService.publish('bot-messages', {
          subscriberId: subscription.id,
          messages: menu.printWithCart(),
        });
      });
  }
}
