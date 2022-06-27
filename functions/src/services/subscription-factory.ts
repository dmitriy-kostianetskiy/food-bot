import { Service } from 'typedi';
import { Subscription } from '../model';
import { CartModelFactory } from './cart-model.factory';
import { CartPrinterService } from './cart-printer.service';
import { MenuModelFactory } from './menu-model.factory';
import { MenuPrinterService } from './menu-printer.service';

@Service()
export class SubscriptionFactory {
  constructor(
    private readonly menuModelFactory: MenuModelFactory,
    private readonly cartModelFactory: CartModelFactory,
    private readonly menuPrinterService: MenuPrinterService,
    private readonly cartPrinterService: CartPrinterService,
  ) {}

  async create(chatId: string): Promise<Subscription> {
    const menu = await this.menuModelFactory.create();
    const cart = await this.cartModelFactory.create(menu);

    const printed = [
      ...this.menuPrinterService.print(menu),
      ...this.cartPrinterService.print(cart),
    ];

    return {
      id: chatId,
      menu,
      cart,
      printed,
    };
  }
}
