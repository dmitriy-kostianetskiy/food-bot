import * as _ from 'lodash'

import { CategoryModel, IngredientModel, MenuModel } from './model'

export type CategoryMapper = (ingredientName: string) => string;

export interface CartIngredient {
  name: string;
  byMeals: {
    index: number;
    amount: number;
    unit: string;
  }[];
}

export class Cart {
  private readonly ingredients: _.Dictionary<CartIngredient[]>;

  constructor(
    private menu: MenuModel,
    private categories: CategoryModel[]
  ) {
    this.ingredients = this.getCartIgredients()
  }

  print(): string {
    const ingredients = _(this.ingredients)
      .reduce((acc, item, key) => {
        const cartIngredients = this.printCartIngredients(item)

        return `${acc}\n<b>${key}</b>\n${cartIngredients}`
      }, '')

    return `🛒 <b>Список покупок:</b>${ingredients}`
  }

  private printCartIngredients(igredients: CartIngredient[]): string {
    return _(igredients).map(value => {
      const amount = _(value.byMeals)
        .groupBy(item => item.unit)
        .mapValues(item => item.reduce((acc, x) => acc + x.amount, 0))
        .map((aggregated, unit) => {
          if (_.isFinite(aggregated) || !aggregated) {
            return unit ? `${aggregated} ${unit}` : `${aggregated}`
          }

          return null
        })
        .filter(item => !!item)
        .join(' + ')

      const indexes = _(value.byMeals)
        .map(item => item.index + 1)
        .uniq()
        .join(', ')

      const amountLine = amount ? ` - ${amount} ` : ' '

      return ` - ${value.name}${amountLine}(${indexes})`
    })
      .orderBy()
      .join('\n')
  }

  private getCartIgredients(): _.Dictionary<CartIngredient[]> {
    const mapping = _(this.categories)
      .flatMap(item => item.ingredients.map(title => ({
        ingredient: title,
        category: item.title
      })))
      .mapKeys(item => item.ingredient)
      .mapValues(item => item.category)
      .value()

    return _(this.getAllIngredients())
      .groupBy(item => item.ingredient.title)
      .map((group, groupKey) => {
        return {
          name: groupKey,
          byMeals: group.map(item => ({
            index: item.index,
            amount: item.ingredient.amount,
            unit: item.ingredient.unit
          }))
        }
      })
      .reduce((acc, item) => {
        const cetegory = mapping[item.name] || 'Другое'
        if (!acc[cetegory]) {
          acc[cetegory] = []
        }

        acc[cetegory].push(item)

        return acc
      }, {})
  }

  private getAllIngredients(): { ingredient: IngredientModel, index: number }[] {
    return _.flatMap(this.menu.dinners, (recipe, index) => {
      const all = recipe.main.ingredients

      if (recipe.side) {
        all.push(...recipe.side.ingredients)
      }

      return all.map(ingredient => ({
        index,
        ingredient
      }))
    })
  }
}
