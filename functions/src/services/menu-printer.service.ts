import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';
import { CategoryModel } from '../model';
import { Menu } from '../menu';

@Service()
export class MenuPrinterService {
  printMenuWithCart(menuModel: MenuModel, categories: readonly CategoryModel[]): readonly string[] {
    if (!menuModel) {
      console.error('Unable to publish menu because menu is not generate.');

      // TODO: DRY
      return ['Что-то пошло не так!'];
    }

    if (!categories || categories.length === 0) {
      console.error('Unable to publish menu because categories are empty.');

      return ['Что-то пошло не так!'];
    }

    const menu = new Menu(menuModel, categories);

    return menu.printWithCart();
  }
}
