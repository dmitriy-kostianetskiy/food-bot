import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { CommunicationService } from '../services/communication.service';
import { topicFunction } from '../utils';

@Service()
export class CreateSubscriptionFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
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
      const subscription = await this.subscriptionService.getOrCreate(id);

      await this.communicationService.sendMessageToChat(id, ...subscription.printed);
    } catch (error) {
      await this.communicationService.sendErrorMessage(id);
      throw error;
    }
  }
}
