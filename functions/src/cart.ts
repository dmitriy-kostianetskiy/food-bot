import * as _ from 'lodash';

import { CategoryModel, IngredientModel, MenuModel } from './model';

export type CategoryMapper = (ingredientName: string) => string;

export interface CartIngredient {
  readonly name: string;
  readonly byMeals: {
    readonly index: number;
    readonly amount: number;
    readonly unit?: string;
  }[];
}

export class Cart {
  private readonly ingredients: _.Dictionary<readonly CartIngredient[]>;

  constructor(private menu: MenuModel, private categories: readonly CategoryModel[]) {
    this.ingredients = this.getCartIngredients();
  }

  print(): string {
    const ingredients = _(this.ingredients).reduce((acc, item, key) => {
      const cartIngredients = this.printCartIngredients(item);

      return `${acc}\n<b>${key}</b>\n${cartIngredients}`;
    }, '');

    return `🛒 <b>Список покупок:</b>${ingredients}`;
  }

  private printCartIngredients(ingredients: readonly CartIngredient[]): string {
    return _(ingredients)
      .map((value) => {
        const amount = _(value.byMeals)
          .groupBy((item) => item.unit)
          .mapValues((item) => item.reduce((acc, x) => acc + x.amount, 0))
          .map((aggregated, unit) => {
            if (_.isFinite(aggregated) && aggregated) {
              return unit ? `${aggregated} ${unit}` : `${aggregated}`;
            }

            return null;
          })
          .filter((item) => !!item)
          .join(' + ');

        const indexes = _(value.byMeals)
          .map((item) => item.index + 1)
          .uniq()
          .join(', ');

        const amountLine = amount ? ` - ${amount} ` : ' ';

        return ` - ${value.name}${amountLine}(${indexes})`;
      })
      .orderBy()
      .join('\n');
  }

  private getCartIngredients(): _.Dictionary<readonly CartIngredient[]> {
    const mapping = _(this.categories)
      .flatMap((item) =>
        item.ingredients.map((title) => ({
          ingredient: title,
          category: item.title,
        })),
      )
      .mapKeys((item) => item.ingredient)
      .mapValues((item) => item.category)
      .value();

    return _(this.getAllIngredients())
      .groupBy((item) => item.ingredient.title)
      .map<CartIngredient>((group, groupKey) => {
        return {
          name: groupKey,
          byMeals: group.map((item) => ({
            index: item.index,
            amount: item.ingredient.amount || 0,
            unit: item.ingredient.unit,
          })),
        };
      })
      .reduce<_.Dictionary<CartIngredient[]>>((acc, item) => {
        const category = mapping[item.name] || 'Другое';
        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(item);

        return acc;
      }, {});
  }

  private getAllIngredients(): readonly {
    readonly ingredient: IngredientModel;
    readonly index: number;
  }[] {
    return _.flatMap(this.menu.dinners, (recipe, index) => {
      const all = [...recipe.main.ingredients, ...(recipe.side ? recipe.side.ingredients : [])];

      return all.map((ingredient) => ({
        index,
        ingredient,
      }));
    });
  }
}
