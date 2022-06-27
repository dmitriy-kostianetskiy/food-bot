import * as _ from 'lodash';
import { createRecipe } from '../test';
import { createStubInstance } from 'sinon';

import { MenuModelFactory } from './menu-model.factory';
import { RecipeService } from './recipe.service';

test('should select 7 items from recipes', async () => {
  // Arrange
  const recipes = _.range(10).map((id) => createRecipe({ id: id.toFixed(0) }));
  const recipesService = createStubInstance(RecipeService, {
    getAll: Promise.resolve(recipes),
  });

  const factory = new MenuModelFactory(recipesService);

  // Act
  const menu = await factory.create();

  // Assert
  expect(menu.dinners).toHaveLength(7);
});
