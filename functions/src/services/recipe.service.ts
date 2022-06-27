import { Service } from 'typedi';
import { RecipeRepository } from '../repositories/recipe.repository';
import { RecipeModel } from '../model';

@Service()
export class RecipeService {
  private cache?: readonly RecipeModel[];

  constructor(private readonly recipeRepository: RecipeRepository) {}

  async getAll(): Promise<readonly RecipeModel[]> {
    if (!this.cache) {
      this.cache = await this.recipeRepository.fetchAll();
    }

    return this.cache;
  }
}
