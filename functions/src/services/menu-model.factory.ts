import * as _ from 'lodash';

import { MenuModel } from '../model';
import { Service } from 'typedi';
import { RecipeService } from './recipe.service';

@Service()
export class MenuModelFactory {
  constructor(private readonly recipeService: RecipeService) {}

  async create(): Promise<MenuModel> {
    const recipes = await this.recipeService.getAll();

    const dinners = _(_.range(recipes.length))
      .shuffle()
      .take(7)
      .map((index) => recipes[index])
      .value();

    return {
      dinners,
    };
  }
}
