import { Service } from 'typedi';
import { Subscription } from '../model';
import { MenuFactory } from './menu.factory';

@Service()
export class SubscriptionFactory {
  constructor(private readonly menuFactory: MenuFactory) {}

  async create(chatId: string): Promise<Subscription> {
    const { model, printed } = await this.menuFactory.generateNew();

    return {
      id: chatId,
      menu: model,
      printed,
    };
  }
}
