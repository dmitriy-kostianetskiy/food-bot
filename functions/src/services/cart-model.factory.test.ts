import { CartModel, CategoryModel, MenuModel } from '../model';
import { RecipeBuilder } from '../test';
import { CartModelFactory } from './cart-model.factory';

import { TranslationService } from './translation.service';

const categories: readonly CategoryModel[] = [
  {
    title: 'Vegetables',
    ingredients: ['Carrot'],
  },
  {
    title: 'Fruits',
    ingredients: ['Apple'],
  },
];

test('should place apples and carrots into fruits and vegetables categories accordingly', () => {
  // Arrange
  const menu: MenuModel = {
    dinners: [
      new RecipeBuilder()
        .withMain((mainBuilder) =>
          mainBuilder
            .withIngredient({
              title: 'Carrot',
              amount: 1,
              unit: 'kg',
            })
            .withIngredient({
              title: 'Apple',
              amount: 2,
              unit: 'pcs',
            })
            .build(),
        )
        .build(),
    ],
  };

  const factory = new CartModelFactory(new TranslationService());

  // Act
  const cart = factory.create(menu, categories);

  // Assert
  const expectedCart: CartModel = {
    categories: [
      {
        title: 'Vegetables',
        items: [
          {
            title: 'Carrot',
            mealIndexes: [0],
            items: [
              {
                amount: 1,
                unit: 'kg',
              },
            ],
          },
        ],
      },
      {
        title: 'Fruits',
        items: [
          {
            title: 'Apple',
            mealIndexes: [0],
            items: [
              {
                amount: 2,
                unit: 'pcs',
              },
            ],
          },
        ],
      },
    ],
  };

  expect(cart).toStrictEqual(expectedCart);
});

test('should set indexes and sum up weight accordingly', () => {
  // Arrange
  const menu: MenuModel = {
    dinners: [
      new RecipeBuilder()
        .withMain((mainBuilder) =>
          mainBuilder
            .withIngredient({
              title: 'Carrot',
              amount: 1,
              unit: 'kg',
            })
            .withIngredient({
              title: 'Apple',
              amount: 2,
              unit: 'pcs',
            })
            .build(),
        )
        .build(),
      new RecipeBuilder()
        .withMain((mainBuilder) =>
          mainBuilder
            .withIngredient({
              title: 'Carrot',
              amount: 3,
              unit: 'kg',
            })
            .withIngredient({
              title: 'Apple',
              amount: 3,
              unit: 'pcs',
            })
            .build(),
        )
        .build(),
    ],
  };

  const factory = new CartModelFactory(new TranslationService());

  // Act
  const cart = factory.create(menu, categories);

  // Assert
  const expectedCart: CartModel = {
    categories: [
      {
        title: 'Vegetables',
        items: [
          {
            title: 'Carrot',
            mealIndexes: [0, 1],
            items: [
              {
                amount: 4,
                unit: 'kg',
              },
            ],
          },
        ],
      },
      {
        title: 'Fruits',
        items: [
          {
            title: 'Apple',
            mealIndexes: [0, 1],
            items: [
              {
                amount: 5,
                unit: 'pcs',
              },
            ],
          },
        ],
      },
    ],
  };

  expect(cart).toStrictEqual(expectedCart);
});

test('should not display unit of measure', () => {
  // Arrange
  const menu: MenuModel = {
    dinners: [
      new RecipeBuilder()
        .withMain((mainBuilder) =>
          mainBuilder
            .withIngredient({
              title: 'Salt',
            })
            .build(),
        )
        .build(),
    ],
  };

  const factory = new CartModelFactory(new TranslationService());

  // Act
  const cart = factory.create(menu, categories);

  // Assert
  const expectedCart: CartModel = {
    categories: [
      {
        title: 'Other',
        items: [
          {
            title: 'Salt',
            mealIndexes: [0],
            items: [],
          },
        ],
      },
    ],
  };

  expect(cart).toStrictEqual(expectedCart);
});

test('should group different units together', () => {
  // Arrange
  const menu: MenuModel = {
    dinners: [
      new RecipeBuilder()
        .withMain((mainBuilder) =>
          mainBuilder
            .withIngredient({
              title: 'Carrot',
              amount: 1,
              unit: 'kg',
            })
            .withIngredient({
              title: 'Carrot',
              amount: 2,
              unit: 'pcs',
            })
            .build(),
        )
        .build(),
    ],
  };

  const factory = new CartModelFactory(new TranslationService());

  // Act
  const cart = factory.create(menu, categories);

  // Assert
  const expectedCart: CartModel = {
    categories: [
      {
        title: 'Vegetables',
        items: [
          {
            title: 'Carrot',
            mealIndexes: [0],
            items: [
              {
                amount: 1,
                unit: 'kg',
              },
              {
                amount: 2,
                unit: 'pcs',
              },
            ],
          },
        ],
      },
    ],
  };

  expect(cart).toStrictEqual(expectedCart);
});
