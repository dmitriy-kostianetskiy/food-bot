import * as _ from 'lodash';

import { MenuModel } from '../model';
import RecipeService from './recipe.service';
import { Service } from 'typedi';

@Service()
export class MenuGeneratorService {
  constructor(readonly recipeService: RecipeService) {}

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
