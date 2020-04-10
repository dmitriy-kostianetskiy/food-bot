import * as _ from 'lodash';
import { Ingredient, Meal, Recipe } from '../model';

export function printMeal(meal: Meal): string {
  let result = '';

  result += meal.recipes.map(recipe => printRecipe(recipe)).join('\n');

  return `${result}\n⏳ Время приготовления: ${meal.readyInTime}`;
}

export function printIngredients(ingredients: Ingredient[]): string {
  const result = ingredients.reduce((acc, value) => {
    const line = value.amount && value.unit
      ? `- ${value.name} - ${value.amount} ${value.unit}`
      : `- ${value.name}`;

    return `${acc}${line}\n`;
  }, '');

  return `
🛒 <b>Ингредиенты:</b>

${result}`;
}

function printRecipe(recipe: Recipe): string {
  const ingredients = printIngredients(recipe.ingredients);

  const steps = recipe.steps.reduce((acc, value, index) => {
    const line = `${printNumber(index + 1)} ${value}\n`;
    return acc + line;
  }, '');

  return `
<b>${recipe.title}</b>

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
    }
  }).join('');
}
