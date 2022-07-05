import { Service } from 'typedi';
import { Language, Subscription } from '../model';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionFactory } from './subscription-factory';

@Service()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionFactory: SubscriptionFactory,
  ) {}

  async getAll(): Promise<readonly Subscription[]> {
    return await this.subscriptionRepository.fetchAll();
  }

  async create(id: string, language: Language): Promise<Subscription> {
    const subscription = await this.subscriptionFactory.create(id, language);

    await this.subscriptionRepository.set(subscription);

    return subscription;
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
