import * as _ from 'lodash';
import { Ingredient, Meal, Recipe, Menu, Cart, CartIngredient } from './model';

export function printMenu({ meals }: Menu): string[] {
  return meals.map((meal, index) => printMeal(meal, index));
}

function pritnCartIngredients(igredients: CartIngredient[]): string {
  return _(igredients).map(value  => {
    const amount = _(value.byMeals)
      .groupBy(item => item.unit)
      .mapValues(item => item.reduce((acc, x) => acc + x.amount, 0))
      .map((aggregated, unit) => {
        if (_.isFinite(aggregated)) {
          return unit ? `${aggregated} ${unit}` : `${aggregated}`;
        }

        return null;
      })
      .filter(item => !!item)
      .join(' + ');
    
    const indexes = _(value.byMeals)
      .map(item => item.index + 1)
      .uniq()
      .join(', ');

    const amountLine = amount ? ` - ${amount} ` : ' ';

    return ` - ${value.name}${amountLine}(${indexes})`;
  })
  .orderBy()
  .join('\n');
}

export function printCart(cart: Cart): string {
  const ingredients = _(cart)
    .reduce((acc, item, key) => {
      const cartIngredients = pritnCartIngredients(item);

      return `${acc}\n<b>${key}</b>\n${cartIngredients}`;
    }, '');

  return `🛒 <b>Список покупок:</b>
${ingredients}`
}

function printMeal(meal: Meal, index: number): string {
  let result = '';

  result += meal.recipes.map(recipe => printRecipe(recipe)).join('\n');

  return `<b>🍜 Ужин № ${index + 1}</b>
<i>⏳ Время приготовления: ${meal.readyInTime}</i>
${result}`;
}

function printRecipe(recipe: Recipe): string {
  const ingredients = recipe.ingredients
    .map(item => printIngredient(item))
    .join('\n');

  const steps = recipe.steps
    .map((item, index) => printStep(item, index))
    .join('\n');

  return `
🍗 <b>${recipe.title}</b>

🛒 <b>Ингредиенты:</b>
${ingredients}

🍽 <b>Рецепт:</b>
${steps}`;
}

function printNumber(value: number): string {
  return _.map(value.toFixed(0), item => {
    switch (item) {
      case '0': return '0️⃣';
      case '1': return '1️⃣';
      case '2': return '2️⃣';
      case '3': return '3️⃣';
      case '4': return '4️⃣';
      case '5': return '5️⃣';
      case '6': return '6️⃣';
      case '7': return '7️⃣';
      case '8': return '8️⃣';
      case '9': return '9️⃣';
      default: return item;
    }
  }).join('');
}

function printStep(value: string, index: number): string {
  return `${printNumber(index + 1)} ${value}`;
}

function printIngredient(value: Ingredient): string {
  const line = value.amount && value.unit
      ? `- ${value.name} - ${value.amount} ${value.unit}`
      : `- ${value.name}`;

    return `${line}`
}
