import { MealModel } from './model';

export function createMeal(meal?: Partial<MealModel>): MealModel {
  return {
    ingredients: [],
    steps: [],
    title: '',
    ...(meal || {})
  };
}
