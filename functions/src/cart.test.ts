import { Cart } from "./cart";

const CATEGORIES = {
  ['Морковь']: 'Овощи',
  ['Помидор']: 'Овощи',
  ['Яблоко']: 'Фрукты',
};

test('should place apples and carrots into fruits and vegetables categories accordingly', () => {
  const cart = new Cart(
    [
      {
        recipes: [
          {
            ingredients: [
              {
                name: 'Морковь',
                amount: 1,
                unit: 'кг'
              },
              {
                name: 'Яблоко',
                amount: 2,
                unit: 'шт'
              }
            ],
            steps: []
          }
        ]
      }
    ],
    name => CATEGORIES[name]
  );

  expect(cart.print()).toBe(
`🛒 <b>Список покупок:</b>
<b>Овощи</b>
 - Морковь - 1 кг (1)
<b>Фрукты</b>
 - Яблоко - 2 шт (1)`
  );
});

test('should set indexes and sum up weight accordingly', () => {
  const cart = new Cart(
    [
      {
        recipes: [
          {
            ingredients: [
              {
                name: 'Морковь',
                amount: 1,
                unit: 'кг'
              },
              {
                name: 'Яблоко',
                amount: 2,
                unit: 'шт'
              }
            ],
            steps: []
          }
        ]
      },
      {
        recipes: [
          {
            ingredients: [
              {
                name: 'Морковь',
                amount: 3,
                unit: 'кг'
              },
              {
                name: 'Яблоко',
                amount: 3,
                unit: 'шт'
              }
            ],
            steps: []
          }
        ]
      }
    ],
    name => CATEGORIES[name]
  );

  expect(cart.print()).toBe(
`🛒 <b>Список покупок:</b>
<b>Овощи</b>
 - Морковь - 4 кг (1, 2)
<b>Фрукты</b>
 - Яблоко - 5 шт (1, 2)`
  );
});
