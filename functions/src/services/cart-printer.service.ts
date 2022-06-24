import { Service } from 'typedi';

import { CartCategory, CartCategoryIngredient, CartModel } from '../model';
import { TranslationService } from './translation.service';

@Service()
export class CartPrinterService {
  constructor(private readonly translationService: TranslationService) {}

  print(cart: CartModel): string {
    const categories = cart.categories.map((category) => this.printCategory(category)).join('\n');
    const cartLabel = this.translationService.get('cart');

    return `🛒 <b>${cartLabel}:</b>\n${categories}`;
  }

  private printCategory(category: CartCategory): string {
    const header = `<b>${category.title}</b>\n`;
    const body = category.items.map((item) => this.printIngredients(item)).join('\n');

    return header + body;
  }

  private printIngredients(ingredient: CartCategoryIngredient): string {
    let result = ` - ${ingredient.title}`;
    if (ingredient.items.length > 0) {
      const amounts = ingredient.items.map(({ amount, unit }) => `${amount} ${unit}`).join(' + ');

      result += ` - ${amounts}`;
    }

    if (ingredient.mealIndexes.length > 0) {
      const indexes = `(${ingredient.mealIndexes.map((index) => index + 1).join(', ')})`;

      result += ` ${indexes}`;
    }

    return result;
  }
}
