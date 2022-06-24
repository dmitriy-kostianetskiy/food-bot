import { CartModel } from '../model';

import { CartPrinterService } from './cart-printer.service';
import { TranslationService } from './translation.service';

test('should place apples and carrots into fruits and vegetables categories accordingly', () => {
  // Arrange
  const cart: CartModel = {
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

  const service = new CartPrinterService(new TranslationService());

  // Act
  const printed = service.print(cart);

  // Assert
  expect(printed).toBe(
    `🛒 <b>Cart:</b>
<b>Vegetables</b>
 - Carrot - 1 kg (1)
<b>Fruits</b>
 - Apple - 2 pcs (1)`,
  );
});

test('should print indexes', () => {
  // Arrange
  const cart: CartModel = {
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

  const service = new CartPrinterService(new TranslationService());

  // Act
  const printed = service.print(cart);

  // Assert
  expect(printed).toBe(
    `🛒 <b>Cart:</b>
<b>Vegetables</b>
 - Carrot - 4 kg (1, 2)
<b>Fruits</b>
 - Apple - 5 pcs (1, 2)`,
  );
});

test('should not display unit of measure', () => {
  // Arrange
  const cart: CartModel = {
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

  const service = new CartPrinterService(new TranslationService());

  // Act
  const printed = service.print(cart);

  // Assert
  expect(printed).toBe(
    `🛒 <b>Cart:</b>
<b>Other</b>
 - Salt (1)`,
  );
});

test('should group different units together', () => {
  // Arrange
  const cart: CartModel = {
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

  const service = new CartPrinterService(new TranslationService());

  // Act
  const printed = service.print(cart);

  // Assert
  expect(printed).toBe(
    `🛒 <b>Cart:</b>
<b>Vegetables</b>
 - Carrot - 1 kg + 2 pcs (1)`,
  );
});
