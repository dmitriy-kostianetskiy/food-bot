import { Service } from 'typedi';
import { CategoryService } from './category.service';
import { IngredientMapper } from './ingredient-mapper';
import { TranslationService } from './translation.service';

@Service()
export class IngredientMapperFactory {
  constructor(
    private readonly translationService: TranslationService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(): Promise<IngredientMapper> {
    const categories = await this.categoryService.getAll();
    return new IngredientMapper(categories, this.translationService.get('otherCategory'));
  }
}
