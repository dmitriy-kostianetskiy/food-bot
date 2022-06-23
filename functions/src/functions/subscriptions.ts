import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionTopicMessage } from '../model/pubsub';
import { CommunicationService } from '../services/communication.service';
import { SubscriptionService } from '../services/subscription.service';

@Service()
export class SubscriptionsFunctionCreator extends FunctionCreator {
  constructor(
    private readonly communicationService: CommunicationService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return pubsub.topic('subscriptions').onPublish(async (message) => {
      const jsonMessage = message.json as SubscriptionTopicMessage;

      try {
        await this.handleMessage(jsonMessage);
      } catch (error) {
        this.communicationService.sendErrorMessage(jsonMessage.id);
        throw error;
      }
    });
  }

  private async handleMessage(message: SubscriptionTopicMessage): Promise<void> {
    switch (message.action) {
      case 'add':
        return await this.subscriptionService.addSubscription(message.id);
      case 'remove':
        return await this.subscriptionService.removeSubscription(message.id);
      default:
        console.log(`Unknown action ${message.action}`);
    }
  }
}
