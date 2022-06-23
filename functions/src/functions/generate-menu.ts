import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { MenuModel } from '../model';
import { CommunicationService } from '../services/communication.service';
import { SubscriptionService } from '../services/subscription.service';
import { MenuService } from '../services/menu.service';
import { topicFunction } from '../utils';

@Service()
export class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor(
    private readonly communicationService: CommunicationService,
    private readonly menuService: MenuService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return topicFunction('generate-menu', async (message) => {
      // for now one chunk of subscriptions will have one menu
      const { model, printed } = await this.menuService.generateNew();

      await Promise.all(
        message.subscriptionIds.map(async (id) => this.handleSubscription(id, model, printed)),
      );
    });
  }

  private async handleSubscription(
    id: string,
    menu: MenuModel,
    printedMenu: readonly string[],
  ): Promise<void> {
    try {
      await this.subscriptionService.set(id, menu);
      await this.communicationService.sendMessageToChat(id, ...printedMenu);
    } catch (error) {
      await this.communicationService.sendErrorMessage(id);
      throw error;
    }
  }
}
