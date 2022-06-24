import * as _ from 'lodash';

import { CategoryModel, MealModel, RecipeModel } from '../model';

import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';
import { CartPrinterService } from './cart-printer.service';

@Service()
export class MenuPrinterService {
  constructor(private readonly cartPrinterService: CartPrinterService) {}

  print(menu: MenuModel, categories: readonly CategoryModel[]): readonly string[] {
    return [...this.printMenu(menu), this.printCart(menu, categories)];
  }

  private printCart(menu: MenuModel, categories: readonly CategoryModel[]): string {
    return this.cartPrinterService.print(menu, categories);
  }

  private printMenu(menu: MenuModel): readonly string[] {
    return menu.dinners.map((item, index) => this.printRecipe(item, index));
  }

  private printRecipe(recipe: RecipeModel, index: number): string {
    let result = '';

    result += this.printMeal(recipe.main);
    if (recipe.side) {
      result += '\n' + this.printMeal(recipe.side);
    }

    return `<b>🍜 Ужин № ${index + 1}</b>\n<i>⏳ Время приготовления: ${
      recipe.readyIn
    }</i>\n${result}`;
  }

  private printMeal(meal: MealModel): string {
    const ingredients = meal.ingredients
      .map(({ amount, unit, title }) =>
        amount && unit ? `- ${title} - ${amount} ${unit}` : `- ${title}`,
      )
      .join('\n');

    const steps = meal.steps
      .map((item, index) => `${this.printNumber(index + 1)} ${item}`)
      .join('\n');

    return `🍗 <b>${meal.title}</b>\n\n🛒 <b>Ингредиенты:</b>\n${ingredients}\n\n🍽 <b>Рецепт:</b>\n${steps}`;
  }

  private printNumber(value: number): string {
    return _.map(value.toFixed(0), (item) => {
      switch (item) {
        case '0':
          return '0️⃣';
        case '1':
          return '1️⃣';
        case '2':
          return '2️⃣';
        case '3':
          return '3️⃣';
        case '4':
          return '4️⃣';
        case '5':
          return '5️⃣';
        case '6':
          return '6️⃣';
        case '7':
          return '7️⃣';
        case '8':
          return '8️⃣';
        case '9':
          return '9️⃣';
        default:
          return item;
      }
    }).join('');
  }
}
