import { Service } from 'typedi';
import { Subscription } from '../model';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionFactory } from './subscription-factory';

@Service()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionFactory: SubscriptionFactory,
  ) {}

  getAll(): Promise<readonly Subscription[]> {
    return this.subscriptionRepository.fetchAll();
  }

  async getOrCreate(id: string): Promise<Subscription> {
    let subscription = await this.subscriptionRepository.get(id);

    if (!subscription) {
      subscription = await this.subscriptionFactory.create(id);

      await this.subscriptionRepository.set(subscription);
    }

    return subscription;
  }

  async createNewOrUpdateExisting(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionFactory.create(id);

    await this.subscriptionRepository.set(subscription);

    return subscription;
  }

  async set(subscription: Subscription): Promise<void> {
    await this.subscriptionRepository.set(subscription);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
