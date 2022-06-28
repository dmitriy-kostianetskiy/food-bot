import { Service } from 'typedi';
import { Language, Subscription } from '../model';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionFactory } from './subscription-factory';
import { TranslationService } from './translation.service';

@Service()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly subscriptionFactory: SubscriptionFactory,
    private readonly translationService: TranslationService,
  ) {}

  async getAll(): Promise<readonly Subscription[]> {
    return await this.subscriptionRepository.fetchAll();
  }

  async getById(id: string): Promise<Subscription | undefined> {
    return await this.subscriptionRepository.get(id);
  }

  async create(id: string, language: Language): Promise<Subscription> {
    let subscription = await this.subscriptionRepository.get(id);

    if (subscription) {
      return subscription;
    }

    subscription = await this.subscriptionFactory.create(id, language);

    await this.subscriptionRepository.set(subscription);

    return subscription;
  }

  async update(id: string): Promise<Subscription | undefined> {
    let subscription = await this.subscriptionRepository.get(id);

    if (!subscription) {
      return subscription;
    }

    subscription = await this.subscriptionFactory.update(subscription);

    await this.subscriptionRepository.set(subscription);

    return subscription;
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
