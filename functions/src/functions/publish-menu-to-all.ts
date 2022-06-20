import { CloudFunction, region } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Menu } from '../menu';
import { MenuService } from '../services/menu.service';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { ConfigurationService } from '../services/configuration.service';
import { CategoryService } from '../services/category.service';

@Service()
export class PublishMenuToAllFunctionCreator extends FunctionCreator {
  constructor (
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly pubsubService: PubsubService,
    private readonly subscriptionService: SubscriptionService,
    private readonly configurationService: ConfigurationService
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return region(this.configurationService.functionRegion)
      .firestore
      .document(this.configurationService.menuPath)
      .onWrite(async () => {
        const [
          subscriptions,
          menuModel,
          categories
        ] = await Promise.all([
          this.subscriptionService.fetchAll(),
          this.menuService.fetchCurrentMenu(),
          this.categoryService.fetchAll()
        ]);

        const menu = new Menu(menuModel, categories);
        const messages = menu.printWithCart();

        await Promise.all(
          subscriptions.map(subscription => (this.pubsubService.publish('bot-messages', {
            messages,
            subscriberId: subscription.id
          })
          )));
      });
  }
}
