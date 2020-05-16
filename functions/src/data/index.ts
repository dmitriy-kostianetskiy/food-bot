import * as recepesData from './recipes.json';
import * as categoriesData from './categories.json';

import { MealModel, CategoryModel } from '../model';
import * as _ from 'lodash';

export const MEALS: MealModel[] = recepesData;
export const CATEGORIES: CategoryModel[] = categoriesData;

export const INGREDIENT_TO_CATEGORY_MAP = _(CATEGORIES)
  .flatMap(item => item.titles.map(title => ({
    ingredient: title,
    category: item.name
  })))
  .mapKeys(item => item.ingredient)
  .mapValues(item => item.category)
  .value();

export const OTHER_CATEGORY = 'Другое';
