import { Service } from 'typedi';
import { Menu } from '../menu';
import { CategoryRepository } from '../repositories/category.repository';
import { MenuRepository } from '../repositories/menu.repository';
import { MenuGeneratorService } from './menu-generator.service';

@Service()
export class MenuService {
  static readonly currentMenuPath = 'menu/current';

  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly menuGenerator: MenuGeneratorService,
  ) {}

  async load(): Promise<Menu> {
    const [menuModel, categoryModels] = await Promise.all([
      this.menuRepository.fetchCurrentMenu(),
      this.categoryRepository.fetchAll(),
    ]);

    return new Menu(menuModel, categoryModels);
  }

  async generateNew(): Promise<void> {
    const menu = await this.menuGenerator.generate();

    await this.menuRepository.replaceCurrentMenu(menu);
  }
}
