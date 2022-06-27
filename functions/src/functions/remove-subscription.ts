import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { CommunicationService } from '../services/communication.service';
import { topicFunction } from '../utils';

@Service()
export class RemoveSubscriptionFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return topicFunction('remove-subscription', async (message) => {
      await this.removeSubscription(message.id);
    });
  }

  private async removeSubscription(id: string): Promise<void> {
    try {
      await this.subscriptionService.remove(id);
      await this.communicationService.sendGoodByeMessage(id);
    } catch (error) {
      await this.communicationService.sendErrorMessage(id);
      throw error;
    }
  }
}
