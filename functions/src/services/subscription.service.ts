import * as admin from 'firebase-admin'

import { SUBSCRIPTIONS_PATH } from '../constants'
import { Service } from 'typedi'
import { Subscription } from '../model'

@Service()
export class SubscriptionService {
  constructor(private firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<Subscription[]> {
    const subscribersCollection = await this.firestore.collection(SUBSCRIPTIONS_PATH).get()

    return subscribersCollection.docs.map(document => document.data() as Subscription)
  }

  async addSubscription(subscription: Subscription): Promise<void> {
    await this.firestore.collection(SUBSCRIPTIONS_PATH).doc(subscription.id).set(subscription)
  }

  async deleteSubscription(id: string): Promise<void> {
    await this.firestore.collection(SUBSCRIPTIONS_PATH).doc(id).delete()
  }
}
