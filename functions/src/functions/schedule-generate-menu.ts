import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { PubsubService } from '../services/pubsub.service';

@Service()
export class ScheduleGenerateMenuFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly pubsubService: PubsubService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return pubsub
      .schedule('every friday 12:00')
      .timeZone('Europe/Moscow')
      .onRun(async () => {
        const subscriptions = await this.subscriptionService.getAll();

        await Promise.all(
          subscriptions.map(async ({ id, language }) => {
            await this.pubsubService.publish('generate-menu', { chatId: id, language });
          }),
        );
      });
  }
}
