import * as recepesData from './recipes.json';
import * as categoriesData from './categories.json';

import { Meal, Category } from '../model';
import * as _ from 'lodash';

export const MEALS: Meal[] = recepesData;
export const CATEGORIES: Category[] = categoriesData;

