import { MealModel, RecipeModel } from '../model';
import { MealBuilder } from './meal-builder';

export class RecipeBuilder {
  private recipe: RecipeModel = {
    id: '1',
    main: {
      ingredients: [],
      steps: [],
      title: 'Main Dish',
    },
  };

  withMain(callback: (builder: MealBuilder) => MealModel) {
    const builder = new MealBuilder(this.recipe.main);

    const main = callback(builder);

    this.recipe = {
      ...this.recipe,
      main,
    };

    return this;
  }

  build(): RecipeModel {
    return this.recipe;
  }
}
