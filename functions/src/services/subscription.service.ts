import * as admin from 'firebase-admin';

import { Service } from 'typedi';
import { Subscription } from '../model';
import { ConfigurationService } from './configuration.service';

@Service()
export class SubscriptionService {
  constructor(
    private readonly firestore: admin.firestore.Firestore,
    private readonly configurationService: ConfigurationService
  ) {}

  async fetchAll(): Promise<Subscription[]> {
    const subscribersCollection = await this.firestore.collection(this.configurationService.subscriptionsPath).get();

    return subscribersCollection.docs.map(document => document.data() as Subscription);
  }

  async addSubscription(subscription: Subscription): Promise<void> {
    await this.firestore.collection(this.configurationService.subscriptionsPath).doc(subscription.id).set(subscription);
  }

  async deleteSubscription(id: string): Promise<void> {
    await this.firestore.collection(this.configurationService.subscriptionsPath).doc(id).delete();
  }
}
