import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { CommunicationService } from '../services/communication.service';
import { SubscriptionService } from '../services/subscription.service';
import { topicFunction } from '../utils';

@Service()
export class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return topicFunction('generate-menu', async (message) => {
      await Promise.all(message.subscriptionIds.map(async (id) => this.handleSubscription(id)));
    });
  }

  private async handleSubscription(id: string): Promise<void> {
    try {
      const subscription = await this.subscriptionService.createNewOrUpdateExisting(id);
      await this.communicationService.sendMessageToChat(id, ...subscription.printed);
    } catch (error) {
      await this.communicationService.sendErrorMessage(id);
      throw error;
    }
  }
}
