import { CategoryModel } from '../model';
import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';
import { CartPrinterService } from './cart-printer.service';
import { MenuPrinterService } from './menu-printer.service';

@Service()
export class PrinterService {
  constructor(
    private readonly menuPrinter: MenuPrinterService,
    private readonly cartPrinter: CartPrinterService,
  ) {}

  print(menu: MenuModel, categories: readonly CategoryModel[]): readonly string[] {
    return [...this.menuPrinter.print(menu), this.cartPrinter.print(menu, categories)];
  }
}
