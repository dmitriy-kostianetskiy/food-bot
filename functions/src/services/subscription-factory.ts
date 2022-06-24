import { Service } from 'typedi';
import { Subscription } from '../model';
import { CartModelFactory } from './cart-model.factory';
import { CartPrinterService } from './cart-printer.service';
import { CategoryService } from './category.service';
import { MenuModelFactory } from './menu-model.factory';
import { MenuPrinterService } from './menu-printer.service';
import { RecipeService } from './recipe.service';

@Service()
export class SubscriptionFactory {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly recipeService: RecipeService,
    private readonly menuModelFactory: MenuModelFactory,
    private readonly cartModelFactory: CartModelFactory,
    private readonly menuPrinterService: MenuPrinterService,
    private readonly cartPrinterService: CartPrinterService,
  ) {}

  async create(chatId: string): Promise<Subscription> {
    const [recipes, categories] = await Promise.all([
      this.recipeService.getAll(),
      this.categoryService.getAll(),
    ]);

    const menu = this.menuModelFactory.create(recipes);
    const cart = this.cartModelFactory.create(menu, categories);

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
