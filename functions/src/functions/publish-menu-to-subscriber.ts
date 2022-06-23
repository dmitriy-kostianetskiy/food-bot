import { CloudFunction, firestore } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { Subscription } from '../model';
import { SubscriptionService } from '../services/subscription.service';
import { MenuService } from '../services/menu.service';
import { CommunicationService } from '../services/communication.service';

@Service()
export class PublishMenuToSubscriberFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuService: MenuService,
    private readonly communicationService: CommunicationService,
  ) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return firestore
      .document(SubscriptionService.specificSubscriptionPath)
      .onCreate(async (snapshot) => {
        const subscription = snapshot.data() as Subscription;
        const subscriberId = subscription?.id;

        if (!subscriberId) {
          return;
        }

        try {
          const menu = await this.menuService.load();
          const messages = menu.printWithCart();

          await this.communicationService.sendMessage(subscriberId, ...messages);
        } catch (error) {
          // TODO: error handling
          console.error(error);
          await this.communicationService.sendErrorMessage(subscriberId);
        }
      });
  }
}
