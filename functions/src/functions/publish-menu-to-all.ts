import { Change, CloudFunction, firestore } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { MenuService } from '../services/menu.service';
import { MenuRepository } from '../repositories/menu.repository';
import { CommunicationService } from '../services/communication.service';
import { Subscription } from '../model';

@Service()
export class PublishMenuToAllFunctionCreator extends FunctionCreator {
  constructor(
    private readonly menuService: MenuService,
    private readonly communicationService: CommunicationService,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {
    super();
  }

  createFunction(): CloudFunction<Change<firestore.DocumentSnapshot>> {
    return firestore.document(MenuRepository.currentMenuPath).onWrite(async () => {
      try {
        // TODO: think of scaling
        const subscriptions = await this.subscriptionRepository.fetchAll();

        await this.handleSubscriptions(subscriptions);
      } catch (error) {
        // TODO: error handling
        console.error(error);
      }
    });
  }

  private async handleSubscriptions(subscriptions: readonly Subscription[]): Promise<void> {
    try {
      const menu = await this.menuService.load();
      const messages = menu.printWithCart();

      await Promise.all(
        subscriptions.map(({ id }) => this.communicationService.sendMessage(id, ...messages)),
      );
    } catch (error) {
      await Promise.all(
        subscriptions.map(({ id }) => this.communicationService.sendErrorMessage(id)),
      );

      throw error;
    }
  }
}
