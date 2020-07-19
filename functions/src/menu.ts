import * as _ from 'lodash';

import { CategoryModel, MealModel, RecipeModel } from './model';

import { Cart } from './cart';
import { MenuModel } from './model/menu-model';

export class Menu {
  readonly cart = new Cart(this.menu, this.categories)

  constructor(
    readonly menu: MenuModel,
    readonly categories: CategoryModel[]
  ) {}

  print(): string[] {
    return this.menu.dinners.map((item, index) => this.printRecipe(item, index));
  }

  printWithCart(): string[] {
    return [
      ...this.print(),
      this.cart.print()
    ];
  }

  private printRecipe(recipe: RecipeModel, index: number): string {
    let result = '';
  
    result += this.printMeal(recipe.main);
    if (recipe.side) {
      result += '\n' + this.printMeal(recipe.side);

    }
  
    return `<b>🍜 Ужин № ${index + 1}</b>\n<i>⏳ Время приготовления: ${recipe.readyIn}</i>\n${result}`;
  }

  private printMeal(meal: MealModel): string {
    const ingredients = meal.ingredients
      .map(({ amount, unit, title }) => amount && unit ? `- ${title} - ${amount} ${unit}` : `- ${title}`)
      .join('\n');
  
    const steps = meal.steps
      .map((item, index) => `${this.printNumber(index + 1)} ${item}`)
      .join('\n');
  
    return `🍗 <b>${meal.title}</b>\n\n🛒 <b>Ингредиенты:</b>\n${ingredients}\n\n🍽 <b>Рецепт:</b>\n${steps}`;
  }

  private printNumber(value: number): string {
    return _.map(value.toFixed(0), item => {
      switch (item) {
        case '0': return '0️⃣';
        case '1': return '1️⃣';
        case '2': return '2️⃣';
        case '3': return '3️⃣';
        case '4': return '4️⃣';
        case '5': return '5️⃣';
        case '6': return '6️⃣';
        case '7': return '7️⃣';
        case '8': return '8️⃣';
        case '9': return '9️⃣';
        default: return item;
      }
    }).join('');
  }
}
