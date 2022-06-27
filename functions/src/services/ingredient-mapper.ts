import * as _ from 'lodash';
import { CategoryModel } from '../model';

export class IngredientMapper {
  private readonly mapping: _.Dictionary<string>;

  constructor(categories: readonly CategoryModel[], private readonly otherCategory: string) {
    this.mapping = this.buildIngredientToCategoryMapping(categories);
  }

  map(ingredient: string): string {
    return this.mapping[ingredient] || this.otherCategory;
  }

  private buildIngredientToCategoryMapping(
    categories: readonly CategoryModel[],
  ): _.Dictionary<string> {
    return _(categories)
      .flatMap((item) =>
        item.ingredients.map((title) => ({
          ingredient: title,
          category: item.title,
        })),
      )
      .mapKeys((item) => item.ingredient)
      .mapValues((item) => item.category)
      .value();
  }
}
