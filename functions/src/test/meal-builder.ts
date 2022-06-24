import { IngredientModel, MealModel } from '../model';

export class MealBuilder {
  private meal: MealModel;

  constructor(meal?: MealModel) {
    this.meal = meal || {
      ingredients: [],
      steps: [],
      title: 'Main Dish',
    };
  }

  withIngredient(ingredient: IngredientModel): this {
    this.meal = {
      ...this.meal,
      ingredients: [...this.meal.ingredients, ingredient],
    };

    return this;
  }

  build(): MealModel {
    return this.meal;
  }
}
