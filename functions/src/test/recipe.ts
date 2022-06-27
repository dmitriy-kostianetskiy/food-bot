import { RecipeModel } from '../model';

export const createRecipe = (model?: Partial<RecipeModel>): RecipeModel => {
  return {
    id: '1',
    main: {
      ingredients: [],
      steps: [],
      title: 'Main Dish',
      ...(model?.main || {}),
    },
    ...(model || {}),
  };
};
