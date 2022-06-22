import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionTopicMessage } from '../model/pubsub';
import { SubscriptionService } from '../services/subscription.service';
import { TelegramService } from '../services/telegram.service';

@Service()
export class SubscriptionsFunctionCreator extends FunctionCreator {
  constructor(
    private readonly telegramService: TelegramService,
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

    await this.telegramService.sendText(
      id,
      'Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽',
    );
  }

  private async removeSubscription(id: string): Promise<void> {
    await this.subscriptionService.deleteSubscription(id);

    await this.telegramService.sendText(id, 'Нам очень жаль, что Вы нас покидаете 😿');
  }
}
