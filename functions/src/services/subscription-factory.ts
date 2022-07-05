import { Service } from 'typedi';
import { Language, Subscription } from '../model';
import { CartModelFactory } from './cart-model.factory';
import { MenuModelFactory } from './menu-model.factory';

@Service()
export class SubscriptionFactory {
  constructor(
    private readonly menuModelFactory: MenuModelFactory,
    private readonly cartModelFactory: CartModelFactory,
  ) {}

  async create(id: string, language: Language): Promise<Subscription> {
    const menu = await this.menuModelFactory.create();
    const cart = await this.cartModelFactory.create(menu);

    return {
      id,
      menu,
      cart,
      language,
    };
  }
}
