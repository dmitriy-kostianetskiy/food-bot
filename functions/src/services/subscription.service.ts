import { Subscription } from '../model';

export class SubscriptionService {
  readonly SUBSCRIPTIONS_PATH = 'subscriptions';

  constructor(private db: FirebaseFirestore.Firestore) {}

  async fetchSubscriptions(): Promise<Subscription[]> {
    const subscribersCollection = await this.db.collection(this.SUBSCRIPTIONS_PATH).get();

    return subscribersCollection.docs.map(document => document.data() as Subscription);
  }

  async addSubscription(subscription: Subscription): Promise<void> {
    await this.db.collection(this.SUBSCRIPTIONS_PATH).doc(subscription.id).set(subscription);
  }

  async deleteSubscription(id: string): Promise<void> {
    await this.db.collection(this.SUBSCRIPTIONS_PATH).doc(id).delete();
  }
}
