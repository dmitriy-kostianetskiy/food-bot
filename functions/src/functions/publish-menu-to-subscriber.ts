import { CloudFunction, firestore } from 'firebase-functions';

import { CategoryService } from '../services/category.service';
import { FunctionCreator } from './function-creator';
import { MenuService } from '../services/menu.service';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';
import { Subscription } from '../model';
import { MenuPrinterService } from '../services/menu-printer.service';
import { SubscriptionService } from '../services/subscription.service';

@Service()
export class PublishMenuToSubscriberFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuService: MenuService,
    private readonly categoryService: CategoryService,
    private readonly menuPrinterService: MenuPrinterService,
    private readonly pubsubService: PubsubService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return firestore
      .document(SubscriptionService.specificSubscriptionPath)
      .onCreate(async (snapshot) => {
        const subscription = snapshot.data() as Subscription;

        if (!subscription?.id) {
          return;
        }

        const [menuModel, categories] = await Promise.all([
          this.menuService.fetchCurrentMenu(),
          this.categoryService.fetchAll(),
        ]);

        const messages = this.menuPrinterService.printMenuWithCart(menuModel, categories);

        await this.pubsubService.publish('bot-messages', {
          subscriberId: subscription.id,
          messages,
        });
      });
  }
}
