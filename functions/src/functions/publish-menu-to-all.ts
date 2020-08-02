import { CloudFunction, region } from 'firebase-functions'
import { DEFAULT_REGION, MENU_PATH } from '../constants'

import { CategoryService } from '../services/category.service'
import { FunctionCreator } from './function-creator'
import { Menu } from '../menu'
import { MenuService } from '../services/menu.service'
import { PubsubService } from '../services/pubsub.service'
import { Service } from 'typedi'
import { SubscriptionService } from '../services/subscription.service'

@Service()
export default class PublishMenuToAllFunctionCreator extends FunctionCreator {
  constructor (
    private menuService: MenuService,
    private categoryService: CategoryService,
    private pubsubService: PubsubService,
    private subscriptionService: SubscriptionService
  ) {
    super()
  }

  createFunction(): CloudFunction<unknown> {
    return region(DEFAULT_REGION)
      .firestore
      .document(MENU_PATH)
      .onWrite(async () => {
        const [
          subscriptions,
          menuModel,
          categories
        ] = await Promise.all([
          this.subscriptionService.fetchAll(),
          this.menuService.fetchCurrentMenu(),
          this.categoryService.fetchAll()
        ])

        const menu = new Menu(menuModel, categories)
        const messages = menu.printWithCart()

        await Promise.all(
          subscriptions.map(subscription => (this.pubsubService.publish('bot-messages', {
            messages,
            subscriberId: subscription.id
          })
          )))
      })
  }
}
