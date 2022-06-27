import * as _ from 'lodash';
import { createRecipe } from '../test';

import { MenuModelFactory } from './menu-model.factory';

test('should select 7 items from recipes', () => {
  // Arrange
  const recipes = _.range(10).map((id) => createRecipe({ id: id.toFixed(0) }));
  const factory = new MenuModelFactory();

  // Act
  const menu = factory.create(recipes);

  // Assert
  expect(menu.dinners).toHaveLength(7);
});
