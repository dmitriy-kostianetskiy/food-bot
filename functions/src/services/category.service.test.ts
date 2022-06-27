import { createStubInstance, assert } from 'sinon';
import { CategoryService } from './category.service';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryModel } from '../model';

test('should get data from repository', async () => {
  // Arrange
  const model: CategoryModel = {
    title: 'Category 1',
    ingredients: ['Ingredient 1', 'Ingredient 2'],
  };

  const repository = createStubInstance(CategoryRepository, {
    fetchAll: Promise.resolve([model]),
  });

  const service = new CategoryService(repository);

  // Act
  const items = await service.getAll();

  // Assert
  expect(items).toStrictEqual([
    {
      title: 'Category 1',
      ingredients: ['Ingredient 1', 'Ingredient 2'],
    },
  ]);
});

test('should cache data', async () => {
  // Arrange
  const repository = createStubInstance(CategoryRepository, {
    fetchAll: Promise.resolve([]),
  });

  const service = new CategoryService(repository);

  // Act
  await service.getAll();
  await service.getAll();
  await service.getAll();

  // Assert
  assert.calledOnce(repository.fetchAll);
});
