import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionTopicMessage } from '../model/pubsub';
import { SubscriptionRepository } from '../services/subscription.service';
import { CommunicationService } from '../services/communication.service';

@Service()
export class SubscriptionsFunctionCreator extends FunctionCreator {
  constructor(
    private readonly communicationService: CommunicationService,
    private readonly subscriptionService: SubscriptionRepository,
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
        return await this.addSubscription(message.id);
      case 'remove':
        return await this.removeSubscription(message.id);
      default:
        console.log(`Unknown action ${message.action}`);
    }
  }

  private async addSubscription(id: string): Promise<void> {
    await this.subscriptionService.addSubscription({
      id,
    });

    this.communicationService.sendMessage(
      id,
      'Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽',
    );
  }

  private async removeSubscription(id: string): Promise<void> {
    await this.subscriptionService.deleteSubscription(id);

    this.communicationService.sendMessage(id, 'Нам очень жаль, что Вы нас покидаете 😿');
  }
}
