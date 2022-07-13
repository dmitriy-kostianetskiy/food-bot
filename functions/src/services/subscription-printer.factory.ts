import { CartModel, MenuModel } from '../model';

import { Service } from 'typedi';
import { CartPrinterService } from './cart-printer.service';
import { MenuPrinterService } from './menu-printer.service';

@Service()
export class SubscriptionPrinterService {
  constructor(
    private readonly menuPrinterService: MenuPrinterService,
    private readonly cartPrinterService: CartPrinterService,
  ) {}

  print(subscription: { menu: MenuModel; cart: CartModel }): readonly string[] {
    return [
      ...this.menuPrinterService.print(subscription.menu),
      this.cartPrinterService.print(subscription.cart),
    ];
  }
}
