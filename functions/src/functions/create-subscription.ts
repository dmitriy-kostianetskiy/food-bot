import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { CommunicationService } from '../services/communication.service';
import { MenuService } from '../services/menu.service';
import { topicFunction } from '../utils';

@Service()
export class CreateSubscriptionFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
    private readonly menuService: MenuService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return topicFunction('create-subscription', async (message) => {
      await this.createSubscription(message.id);
    });
  }

  private async createSubscription(id: string): Promise<void> {
    try {
      const { model, printed } = await this.menuService.generateNew();
      await this.subscriptionService.set(id, model);
      await this.communicationService.sendMessageToChat(id, ...printed);
    } catch (error) {
      await this.communicationService.sendErrorMessage(id);
      throw error;
    }
  }
}
