import { MenuModel, MealModel, RecipeModel, CategoryModel } from './model';
import * as _ from 'lodash';
import { Cart } from './cart';
import { MEALS } from './data';

export class Menu {
  static createRandom(): Menu {
    const meals = _(_.range(MEALS.length))
      .shuffle()
      .take(7)
      .map(index => MEALS[index])
      .value();

    return new Menu({ meals });
  }

  constructor(readonly menu: MenuModel) {}

  createCart(): Cart {
    return new Cart(this.menu.meals)
  }

  print(): string[] {
    return this.menu.meals.map((meal, index) => this.printMeal(meal, index));
  }

  private printMeal(meal: MealModel, index: number): string {
    let result = '';
  
    result += meal.recipes.map(recipe => this.printRecipe(recipe)).join('\n');
  
    return `<b>🍜 Ужин № ${index + 1}</b>\n<i>⏳ Время приготовления: ${meal.readyInTime}</i>\n${result}`;
  }

  private printRecipe(recipe: RecipeModel): string {
    const ingredients = recipe.ingredients
      .map(({ amount, unit, name }) => amount && unit ? `- ${name} - ${amount} ${unit}` : `- ${name}`)
      .join('\n');
  
    const steps = recipe.steps
      .map((item, index) => `${this.printNumber(index + 1)} ${item}`)
      .join('\n');
  
    return `🍗 <b>${recipe.title}</b>\n\n🛒 <b>Ингредиенты:</b>\n${ingredients}\n\n🍽 <b>Рецепт:</b>\n${steps}`;
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
