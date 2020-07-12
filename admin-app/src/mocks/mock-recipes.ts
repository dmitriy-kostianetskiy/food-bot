import { RecipeModel } from "../model/recipe-model";

const recipes: RecipeModel[] = [
  {
    title: 'Хрючиве',
    readyIn: 30,
    ingredients: [
      {
        title: 'Мазик',
        amount: 1,
        unit: 'п'
      },
      {
        title: 'Картоха',
        amount: 20,
        unit: 'кг'
      },
      {
        title: 'Петрушка'
      }
    ],
    steps: [
      'Баран кидаем',
      'Трава кидаем',
      'Ногой перемешиваем',
      'Готово Хрючиве'
    ]
  },
  {
    title: 'Шавуха',
    readyIn: 30,
    ingredients: [
      {
        title: 'Мазик',
        amount: 1,
        unit: 'п'
      },
      {
        title: 'Картоха',
        amount: 20,
        unit: 'кг'
      },
      {
        title: 'Петрушка'
      }
    ],
    steps: [
      'Хуяк',
      'Хуяк',
      'Готова Шавуха'
    ]
  },
  {
    title: 'Оливьешка',
    readyIn: 30,
    ingredients: [
      {
        title: 'Мазик',
        amount: 1,
        unit: 'п'
      },
      {
        title: 'Картоха',
        amount: 20,
        unit: 'кг'
      },
      {
        title: 'Петрушка'
      }
    ],
    steps: [
      'Хуяк',
      'Хуяк',
      'Готова Оливьешка'
    ]
  }
];

export default recipes;
