import * as _ from 'lodash';
import { Service } from 'typedi';

import { CategoryModel, IngredientModel, MenuModel } from '../model';

export interface CartIngredient {
  readonly name: string;
  readonly byMeals: {
    readonly index: number;
    readonly amount: number;
    readonly unit?: string;
  }[];
}

@Service()
export class CartPrinterService {
  print(menu: MenuModel, categories: readonly CategoryModel[]): string {
    const cartIngredients = this.getCartIngredients(menu, categories);

    const ingredients = _(cartIngredients).reduce((acc, item, key) => {
      const printedIngredients = this.printCartIngredients(item);

      return `${acc}\n<b>${key}</b>\n${printedIngredients}`;
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

  private getCartIngredients(
    menu: MenuModel,
    categories: readonly CategoryModel[],
  ): _.Dictionary<readonly CartIngredient[]> {
    const mapping = _(categories)
      .flatMap((item) =>
        item.ingredients.map((title) => ({
          ingredient: title,
          category: item.title,
        })),
      )
      .mapKeys((item) => item.ingredient)
      .mapValues((item) => item.category)
      .value();

    return _(this.getAllIngredients(menu))
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

  private getAllIngredients(menu: MenuModel): readonly {
    readonly ingredient: IngredientModel;
    readonly index: number;
  }[] {
    return _.flatMap(menu.dinners, (recipe, index) => {
      const all = [...recipe.main.ingredients, ...(recipe.side ? recipe.side.ingredients : [])];

      return all.map((ingredient) => ({
        index,
        ingredient,
      }));
    });
  }
}
