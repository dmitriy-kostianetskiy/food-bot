import { IngredientMapperFactory } from './ingredient-mapper.factory';
import { TranslationService } from './translation.service';
import { createStubInstance, stub, assert } from 'sinon';
import { TranslationKey } from '../model';
import { CategoryService } from './category.service';

test('should publish message to pubsub', async () => {
  // Arrange
  const categoriesService = createStubInstance(CategoryService, {
    getAll: Promise.resolve([]),
  });

  const translationService = createStubInstance(TranslationService, {
    get: stub<[key: TranslationKey], string>().withArgs('otherCategory').returns('Other'),
  });

  const factory = new IngredientMapperFactory(translationService, categoriesService);

  // Act
  await factory.create();

  // Assert
  assert.calledOnceWithExactly(translationService.get, 'otherCategory1');
});
