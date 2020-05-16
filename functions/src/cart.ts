import * as _ from 'lodash';
import { Meal, Cart } from './model';
import { CATEGORIES } from './data';

export const INGREDIENT_TO_CATEGORY_MAP = _(CATEGORIES)
  .flatMap(item => item.titles.map(title => ({
    ingredient: title,
    category: item.name
  })))
  .mapKeys(item => item.ingredient)
  .mapValues(item => item.category)
  .value();

export const OTHER_CATEGORY = 'Другое';

export function buildCart(meals: Meal[]): Cart {
  return _(meals)
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
      const cetegory = getCategoryNameByIgredientName(item.name);
      if (!acc[cetegory]) {
        acc[cetegory] = [];
      }

      acc[cetegory].push(item);

      return acc;
    }, {});
}

function getCategoryNameByIgredientName(ingredientName: string): string {
  return INGREDIENT_TO_CATEGORY_MAP[ingredientName] || OTHER_CATEGORY;
}
