import { CloudFunction, firestore } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { MenuService } from '../services/menu.service';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { CategoryService } from '../services/category.service';
import { MenuPrinterService } from '../services/menu-printer.service';

@Service()
export class PublishMenuToAllFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly menuPrinterService: MenuPrinterService,
    private readonly pubsubService: PubsubService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return firestore.document(MenuService.currentMenuPath).onWrite(async () => {
      const [subscriptions, menuModel, categories] = await Promise.all([
        this.subscriptionService.fetchAll(),
        this.menuService.fetchCurrentMenu(),
        this.categoryService.fetchAll(),
      ]);

      const messages = this.menuPrinterService.printMenuWithCart(menuModel, categories);

      await Promise.all(
        subscriptions.map((subscription) =>
          this.pubsubService.publish('bot-messages', {
            messages,
            subscriberId: subscription.id,
          }),
        ),
      );
    });
  }
}
