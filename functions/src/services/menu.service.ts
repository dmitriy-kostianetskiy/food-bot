import { Service } from 'typedi';
import { MenuPrinterService } from './menu-printer.service';
import { CategoryRepository } from '../repositories/category.repository';
import { RecipeRepository } from '../repositories/recipe.repository';
import { MenuGeneratorService } from './menu-generator.service';
import { MenuModel } from '../model';

@Service()
export class MenuService {
  static readonly currentMenuPath = 'menu/current';

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly recipeService: RecipeRepository,
    private readonly menuGenerator: MenuGeneratorService,
    private readonly menuPrinterService: MenuPrinterService,
  ) {}

  async generateNew(): Promise<{ readonly model: MenuModel; readonly printed: readonly string[] }> {
    const [recipes, categories] = await Promise.all([
      this.recipeService.fetchAll(),
      this.categoryRepository.fetchAll(),
    ]);

    const model = this.menuGenerator.generate(recipes);
    const printed = this.menuPrinterService.print(model, categories);

    return { model, printed };
  }
}
