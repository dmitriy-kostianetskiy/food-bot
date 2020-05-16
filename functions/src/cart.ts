import * as _ from 'lodash';
import { MealModel } from './model';
import { OTHER_CATEGORY, INGREDIENT_TO_CATEGORY_MAP } from './data';

export type CategoryMapper = (ingredientName: string) => string;

export interface CartIngredient {
  name: string;
  byMeals: {
    index: number;
    amount: number;
    unit: string;
  }[];
}

export const defaultCategoryMapper = (ingredientName: string) => INGREDIENT_TO_CATEGORY_MAP[ingredientName] || OTHER_CATEGORY;

export class Cart {
  private readonly ingredients: _.Dictionary<CartIngredient[]>;

  constructor(
    private meals: MealModel[],
    private categoryMapper: CategoryMapper = defaultCategoryMapper
  ) {
    this.ingredients = this.getCartIgredients();
  }

  print(): string {
    const ingredients = _(this.ingredients)
      .reduce((acc, item, key) => {
        const cartIngredients = this.pritnCartIngredients(item);
  
        return `${acc}\n<b>${key}</b>\n${cartIngredients}`;
      }, '');
  
    return `🛒 <b>Список покупок:</b>${ingredients}`
  }

  private pritnCartIngredients(igredients: CartIngredient[]): string {
    return _(igredients).map(value  => {
      const amount = _(value.byMeals)
        .groupBy(item => item.unit)
        .mapValues(item => item.reduce((acc, x) => acc + x.amount, 0))
        .map((aggregated, unit) => {
          if (_.isFinite(aggregated)) {
            return unit ? `${aggregated} ${unit}` : `${aggregated}`;
          }
  
          return null;
        })
        .filter(item => !!item)
        .join(' + ');
      
      const indexes = _(value.byMeals)
        .map(item => item.index + 1)
        .uniq()
        .join(', ');
  
      const amountLine = amount ? ` - ${amount} ` : ' ';
  
      return ` - ${value.name}${amountLine}(${indexes})`;
    })
    .orderBy()
    .join('\n');
  }

  private getCartIgredients(): _.Dictionary<CartIngredient[]> {
    return _(this.meals)
      .flatMap((meal, index) => _.flatMap(meal.recipes, recipe => recipe.ingredients).map(ingredient => ({
        index,
        ingredient
      })))
      .map()
      .groupBy(item => item.ingredient.name)
      .map((group, groupKey)  => {
        return {
          name: groupKey,
          byMeals: group.map(item => ({
            index: item.index,
            amount: item.ingredient.amount,
            unit: item.ingredient.unit
          }))
        };
      })
      .reduce((acc, item) => {
        const cetegory = this.categoryMapper(item.name);
        if (!acc[cetegory]) {
          acc[cetegory] = [];
        }

        acc[cetegory].push(item);

        return acc;
      }, {});
  }
}
