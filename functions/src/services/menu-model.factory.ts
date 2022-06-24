import * as _ from 'lodash';

import { MenuModel, RecipeModel } from '../model';
import { Service } from 'typedi';

@Service()
export class MenuModelFactory {
  create(recipes: readonly RecipeModel[]): MenuModel {
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
