import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionTopicMessage } from '../model/pubsub';
import { SubscriptionService } from '../services/subscription.service';
import { PubsubService } from '../services/pubsub.service';

@Service()
export class SubscriptionsFunctionCreator extends FunctionCreator {
  constructor(
    private readonly pubsubService: PubsubService,
    private readonly subscriptionService: SubscriptionService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return pubsub.topic('subscriptions').onPublish(async (message) => {
      const jsonMessage = message.json as SubscriptionTopicMessage;

      // TODO: Error Handling
      await this.handleMessage(jsonMessage);

      await this.subscriptionService.addSubscription({
        id: jsonMessage.id,
      });
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

    this.pubsubService.publish('bot-messages', {
      messages: [
        'Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽',
      ],
      subscriberId: id,
    });
  }

  private async removeSubscription(id: string): Promise<void> {
    await this.subscriptionService.deleteSubscription(id);

    this.pubsubService.publish('bot-messages', {
      messages: ['Нам очень жаль, что Вы нас покидаете 😿'],
      subscriberId: id,
    });
  }
}
