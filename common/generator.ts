import * as _ from 'lodash';
import { Ingredient, Meal } from '../model';
import * as data from '../recipes.json';

export function getMeals(indexes: number[]): Meal[] {
  return _(indexes)
    .map(index => data[index])
    .value();
}

export function getIngredients(indexes: number[]): Ingredient[] {
  return _(indexes)
    .flatMap(index => data[index].recipes.map(recipe => recipe.ingredients))
    .flatMap()
    .groupBy(item => item.name)
    .mapValues(value => {
      const amount = _(value)
        .map(item => item.amount)
        .filter()
        .reduce((acc, item) => acc + item, 0);

      const unit = _(value).map(item => item.unit).first();

      return { amount, unit };
    })
    .map((value, index) => ({
      unit: value.unit,
      amount: value.amount,
      name: index
    }))
    .orderBy(value => value.name)
    .value();
}

export function generateIndexes(): number[] {
  return _(_.range(data.length))
    .shuffle()
    .take(5)
    .map()
    .value();
}
