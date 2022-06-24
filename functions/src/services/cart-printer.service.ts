import * as _ from 'lodash';
import { Service } from 'typedi';

import { CategoryModel, IngredientModel, MenuModel, RecipeModel } from '../model';
import { TranslationService } from './translation.service';

interface CartIngredient {
  readonly name: string;
  readonly byMeals: {
    readonly index: number;
    readonly amount: number;
    readonly unit?: string;
  }[];
}

@Service()
export class CartPrinterService {
  constructor(private readonly translationService: TranslationService) {}

  print(menu: MenuModel, categories: readonly CategoryModel[]): string {
    const cartIngredients = this.getCartIngredients(menu.dinners, categories);

    const ingredients = _(cartIngredients).reduce((acc, item, key) => {
      const printedIngredients = this.printCartIngredients(item);

      return `${acc}\n<b>${key}</b>\n${printedIngredients}`;
    }, '');

    const cartLabel = this.translationService.get('cart');

    return `🛒 <b>${cartLabel}:</b>${ingredients}`;
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
    recipes: readonly RecipeModel[],
    categories: readonly CategoryModel[],
  ): _.Dictionary<readonly CartIngredient[]> {
    const mapping = this.buildIngredientToCategoryMapping(categories);
    const otherCategory = this.translationService.get('otherCategory');

    return _(this.getIndexIngredientPairs(recipes))
      .groupBy(([, ingredient]) => ingredient.title)
      .map<CartIngredient>((group, groupKey) => {
        return {
          name: groupKey,
          byMeals: group.map(([index, ingredient]) => ({
            index: index,
            amount: ingredient.amount || 0,
            unit: ingredient.unit,
          })),
        };
      })
      .reduce<_.Dictionary<CartIngredient[]>>((acc, item) => {
        const category = mapping[item.name] || otherCategory;
        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(item);

        return acc;
      }, {});
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

  private getIndexIngredientPairs(recipes: readonly RecipeModel[]): [number, IngredientModel][] {
    return _.flatMap(recipes, (recipe, index) => {
      const all = this.getAllRecipeIngredients(recipe);

      return all.map((ingredient) => ({
        index,
        ingredient,
      }));
    }).map(({ index, ingredient }) => [index, ingredient]);
  }

  private getAllRecipeIngredients(recipe: RecipeModel): readonly IngredientModel[] {
    return [...recipe.main.ingredients, ...(recipe.side ? recipe.side.ingredients : [])];
  }
}
