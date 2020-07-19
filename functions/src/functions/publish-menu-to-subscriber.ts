import { CloudFunction, region } from 'firebase-functions';
import { DEFAULT_REGION, SUBSCRIPTIONS_PATH } from '../constants';

import { CategoryService } from '../services/category.service';
import { FunctionCreator } from './function-creator';
import { Menu } from '../menu';
import { MenuService } from '../services/menu.service';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';
import { Subscription } from '../model';

@Service()
export default class PublishMenuToSubscriberFunctionCreator extends FunctionCreator {
  constructor (
    private menuService: MenuService,
    private categoryService: CategoryService,
    private pubsubService: PubsubService
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return region(DEFAULT_REGION)
    .firestore
    .document(`${SUBSCRIPTIONS_PATH}/{subscribersId}`)
    .onCreate(async (snapshot) => {
      const subscription = snapshot.data() as Subscription;
      
      if (!subscription?.id) {
        return;
      }
  
      const [
        menuModel,
        categories
      ] = await Promise.all([
        this.menuService.fetchCurrentMenu(),
        this.categoryService.fetchAll()
      ]);
  
      const menu = new Menu(menuModel, categories);
  
      await this.pubsubService.publish('bot-messages', {
        subscriberId: subscription.id,
        messages: menu.printWithCart()
      });
    })
  }
}
