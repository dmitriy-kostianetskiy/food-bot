import { Service } from 'typedi';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { CommunicationService } from './communication.service';

@Service()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly communicationService: CommunicationService,
  ) {}

  async addSubscription(id: string): Promise<void> {
    await this.subscriptionRepository.addSubscription({
      id,
    });

    this.communicationService.sendMessage(
      id,
      'Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽',
    );
  }

  async removeSubscription(id: string): Promise<void> {
    await this.subscriptionRepository.deleteSubscription(id);

    this.communicationService.sendMessage(id, 'Нам очень жаль, что Вы нас покидаете 😿');
  }
}
