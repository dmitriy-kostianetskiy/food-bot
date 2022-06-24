import * as _ from 'lodash';

import { IngredientModel, MealModel, RecipeModel } from '../model';

import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';
import { TranslationService } from './translation.service';

@Service()
export class MenuPrinterService {
  constructor(private readonly translationService: TranslationService) {}

  print(menu: MenuModel): readonly string[] {
    return [...this.printRecipes(menu.dinners)];
  }

  private printRecipes(recipes: readonly RecipeModel[]): readonly string[] {
    return recipes.map((item, index) => this.printRecipe(item, index));
  }

  private printRecipe(recipe: RecipeModel, index: number): string {
    const header = this.printRecipeHeader(index + 1, recipe.readyIn);
    const body = this.printRecipeBody(recipe);

    return header + body;
  }

  private printRecipeBody(recipe: RecipeModel): string {
    let result = '';

    result += this.printMeal(recipe.main);
    if (recipe.side) {
      result += '\n' + this.printMeal(recipe.side);
    }

    return result;
  }

  private printRecipeHeader(dinerNumber: number, readyIn?: string): string {
    const dinerLine = this.printDinerHeader(dinerNumber);

    if (!readyIn) {
      return dinerLine;
    }

    const cookingTimeLine = this.printCookingTimeHeader(readyIn);

    return dinerLine + cookingTimeLine;
  }

  private printDinerHeader(dinerNumber: number): string {
    const dinerLabel = this.translationService.get('diner');

    return `<b>🍜 ${dinerLabel} № ${dinerNumber}</b>\n`;
  }

  private printCookingTimeHeader(readyIn: string | undefined): string {
    if (!readyIn) {
      return '';
    }

    const cookingTimeLabel = this.translationService.get('cookingTime');
    return `<i>⏳ ${cookingTimeLabel}: ${readyIn}</i>\n`;
  }

  private printMeal(meal: MealModel): string {
    const ingredientsLabel = this.translationService.get('ingredients');
    const ingredients = this.printIngredients(meal.ingredients);

    const stepsLabel = this.translationService.get('steps');
    const steps = this.printSteps(meal.steps);

    return `🍗 <b>${meal.title}</b>\n\n🛒 <b>${ingredientsLabel}:</b>\n${ingredients}\n\n🍽 <b>${stepsLabel}:</b>\n${steps}`;
  }

  private printIngredients(ingredients: readonly IngredientModel[]): string {
    return ingredients
      .map(({ amount, unit, title }) =>
        amount && unit ? `- ${title} - ${amount} ${unit}` : `- ${title}`,
      )
      .join('\n');
  }

  private printSteps(steps: readonly string[]): string {
    return steps.map((item, index) => `${this.printNumber(index + 1)} ${item}`).join('\n');
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
