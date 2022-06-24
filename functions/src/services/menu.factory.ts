import { Service } from 'typedi';
import { MenuPrinterService } from './menu-printer.service';
import { MenuModelFactory } from './menu-model.factory';
import { MenuModel } from '../model';
import { CategoryService } from './category.service';
import { RecipeService } from './recipe.service';

@Service()
export class MenuFactory {
  static readonly currentMenuPath = 'menu/current';

  constructor(
    private readonly categoryService: CategoryService,
    private readonly recipeService: RecipeService,
    private readonly menuModelFactory: MenuModelFactory,
    private readonly menuPrinterService: MenuPrinterService,
  ) {}

  async generateNew(): Promise<{ readonly model: MenuModel; readonly printed: readonly string[] }> {
    const [recipes, categories] = await Promise.all([
      this.recipeService.getAll(),
      this.categoryService.getAll(),
    ]);

    const model = this.menuModelFactory.create(recipes);
    const printed = this.menuPrinterService.print(model, categories);

    return { model, printed };
  }
}
