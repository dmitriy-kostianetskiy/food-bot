import * as admin from 'firebase-admin';

import { Service } from 'typedi';
import { Subscription } from '../model';

@Service()
export class SubscriptionRepository {
  private get collection(): admin.firestore.CollectionReference<Subscription> {
    return this.firestore.collection(
      'subscriptions',
    ) as admin.firestore.CollectionReference<Subscription>;
  }

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<readonly Subscription[]> {
    const subscribersCollection = await this.collection.get();

    return subscribersCollection.docs.map((document) => document.data() as Subscription);
  }

  async get(id: string): Promise<Subscription | undefined> {
    return (await this.collection.doc(id).get()).data();
  }

  async set(subscription: Subscription): Promise<void> {
    await this.collection.doc(subscription.id).set(subscription);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
