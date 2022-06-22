import * as admin from 'firebase-admin';

import { Service } from 'typedi';
import { Subscription } from '../model';

@Service()
export class SubscriptionService {
  static readonly subscriptionsPath = 'subscriptions';
  static readonly specificSubscriptionPath = 'subscriptions/{subscribersId}';

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<readonly Subscription[]> {
    const subscribersCollection = await this.firestore
      .collection(SubscriptionService.subscriptionsPath)
      .get();

    return subscribersCollection.docs.map((document) => document.data() as Subscription);
  }

  async addSubscription(subscription: Subscription): Promise<void> {
    await this.firestore
      .collection(SubscriptionService.subscriptionsPath)
      .doc(subscription.id)
      .set(subscription);
  }

  async deleteSubscription(id: string): Promise<void> {
    await this.firestore.collection(SubscriptionService.subscriptionsPath).doc(id).delete();
  }
}
