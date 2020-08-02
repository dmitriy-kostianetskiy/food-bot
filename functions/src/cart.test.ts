import { CategoryModel, MenuModel } from './model'

import { Cart } from './cart'

const categories: CategoryModel[] = [
  {
    title: 'Овощи',
    ingredients: [
      'Морковь'
    ]
  },
  {
    title: 'Фрукты',
    ingredients: [
      'Яблоко'
    ]
  }
]

test('should place apples and carrots into fruits and vegetables categories accordingly', () => {
  const menu: MenuModel = {
    dinners: [
      {
        id: 'meal-id',
        main: {
          ingredients: [
            {
              title: 'Морковь',
              amount: 1,
              unit: 'кг'
            },
            {
              title: 'Яблоко',
              amount: 2,
              unit: 'шт'
            }
          ],
          steps: [],
          title: 'Meal'
        }
      }
    ]
  }

  const cart = new Cart(menu, categories)

  expect(cart.print()).toBe(
`🛒 <b>Список покупок:</b>
<b>Овощи</b>
 - Морковь - 1 кг (1)
<b>Фрукты</b>
 - Яблоко - 2 шт (1)`
  )
})

test('should set indexes and sum up weight accordingly', () => {
  const menu: MenuModel = {
    dinners: [
      {
        id: 'meal-1-id',
        main: {
          ingredients: [
            {
              title: 'Морковь',
              amount: 1,
              unit: 'кг'
            },
            {
              title: 'Яблоко',
              amount: 2,
              unit: 'шт'
            }
          ],
          steps: [],
          title: 'Meal'
        }
      },
      {
        id: 'meal-2-id',
        main: {
          ingredients: [
            {
              title: 'Морковь',
              amount: 3,
              unit: 'кг'
            },
            {
              title: 'Яблоко',
              amount: 3,
              unit: 'шт'
            }
          ],
          steps: [],
          title: 'Meal'
        }
      }
    ]
  }

  const cart = new Cart(menu, categories)

  expect(cart.print()).toBe(
`🛒 <b>Список покупок:</b>
<b>Овощи</b>
 - Морковь - 4 кг (1, 2)
<b>Фрукты</b>
 - Яблоко - 5 шт (1, 2)`
  )
})

test('should not display unit of measure', () => {
  const menu: MenuModel = {
    dinners: [
      {
        id: 'meal-id',
        main: {
          ingredients: [
            {
              title: 'Соль'
            }
          ],
          steps: [],
          title: 'Meal'
        }
      }
    ]
  }

  const cart = new Cart(menu, categories)

  expect(cart.print()).toBe(
`🛒 <b>Список покупок:</b>
<b>Другое</b>
 - Соль (1)`
  )
})
