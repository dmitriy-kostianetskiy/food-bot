import { createStubInstance, assert } from 'sinon';
import { RecipeRepository } from '../repositories/recipe.repository';
import { RecipeModel } from '../model';
import { RecipeService } from './recipe.service';
import { createRecipe } from '../test';

test('should get data from repository', async () => {
  // Arrange
  const model: RecipeModel = createRecipe();

  const repository = createStubInstance(RecipeRepository, {
    fetchAll: Promise.resolve([model]),
  });

  const service = new RecipeService(repository);

  // Act
  const items = await service.getAll();

  // Assert
  expect(items).toStrictEqual([model]);
});

test('should cache data', async () => {
  // Arrange
  const repository = createStubInstance(RecipeRepository, {
    fetchAll: Promise.resolve([]),
  });

  const service = new RecipeService(repository);

  // Act
  await service.getAll();
  await service.getAll();
  await service.getAll();

  // Assert
  assert.calledOnce(repository.fetchAll);
});
