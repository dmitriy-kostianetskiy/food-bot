import { Service } from 'typedi';
import { MenuModel, Subscription } from '../model';
import { SubscriptionRepository } from '../repositories/subscription.repository';

@Service()
export class SubscriptionService {
  constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

  load(): Promise<readonly Subscription[]> {
    return this.subscriptionRepository.fetchAll();
  }

  async set(id: string, menu: MenuModel): Promise<void> {
    await this.subscriptionRepository.set({
      id,
      menu,
    });
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionRepository.delete(id);
  }
}
