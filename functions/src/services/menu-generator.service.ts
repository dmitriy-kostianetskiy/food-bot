import * as _ from 'lodash';

import { MenuModel } from '../model';
import { RecipeRepository } from '../repositories/recipe.repository';
import { Service } from 'typedi';

@Service()
export class MenuGeneratorService {
  constructor(readonly recipeService: RecipeRepository) {}

  async generate(): Promise<MenuModel> {
    const allRecipes = await this.recipeService.fetchAll();

    const dinners = _(_.range(allRecipes.length))
      .shuffle()
      .take(7)
      .map((index) => allRecipes[index])
      .value();

    return {
      dinners,
    };
  }
}
