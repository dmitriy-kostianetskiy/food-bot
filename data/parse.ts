import * as fst from 'fs';
import * as path from 'path';

const fs = fst.promises;
const sourcePath = path.join(__dirname, 'dist-txt-edited');
const distPath = path.join(__dirname, 'dist-json');

async function main(): Promise<void> {
  const files = await fs.readdir(sourcePath);

  for (const file of files) {
    const inputFilePath = path.join(sourcePath, file);
    const outputFilePath = path.join(distPath, file + '.json');

    await parseFile(inputFilePath, outputFilePath);
  }
}

async function parseFile(inputFile: string, outputFile: string): Promise<void> {
  console.log(`Start convert file '${inputFile}'`);

  const content = await fs.readFile(inputFile, 'utf-8');
  const result = transformContent(content);
  await fs.writeFile(outputFile, JSON.stringify(result, null, 2));

  printResult(result);

  console.log(`Finish convert file '${inputFile}'`);
}

interface Recipe {
  title?: string;
  ingredients: Ingredient[];
  steps: string[];
}

interface Ingredient {
  name: string;
  amount?: number;
  unit?: string;
}

interface Meal {
  readyInTime?: string;
  recipes: Recipe[];
}

enum Section {
  Unknown,
  Ingredients,
  IngredientsList,
  Steps
}

function transformContent(content: string): Meal[] {
  const lines = content.split('\r\n');

  const result: Meal[] = [];
  let currentMeal: Meal;
  let currentRecipe: Recipe;
  let currentStep = '';
  let currentSection = Section.Unknown;

  lines.forEach((line, index) => {
    if (isMeal(line)) {
      if (currentMeal) {
        result.push(currentMeal);
      }

      currentMeal = {
        recipes: []
      };

      currentSection = Section.Unknown;

      return;
    }

    if (isIngredients(line)) {
      currentSection = Section.Ingredients;

      if (currentRecipe) {
        currentMeal.recipes.push(currentRecipe);
      }

      currentRecipe = {
        steps: [],
        ingredients: []
      };
      return;
    }

    if (isSteps(line)) {
      currentSection = Section.Steps;

      if (currentRecipe) {
        if (currentMeal.recipes.length > 0) {
          currentRecipe.title = lines[index - 1];
          currentRecipe.ingredients.pop();
        } else {
          currentRecipe.title = lines[index - 2];
          currentMeal.readyInTime = lines[index - 1];

          currentRecipe.ingredients.pop();
          currentRecipe.ingredients.pop();
        }
      }

      return;
    }

    if (isMenu(line) || isIngredientList(line)) {
      currentSection = Section.Unknown;

      if (currentRecipe) {
        currentMeal.recipes.push(currentRecipe);
      }

      if (currentMeal) {
        result.push(currentMeal);
      }

      currentMeal = null;
      currentRecipe = null;
      return;
    }

    switch (currentSection) {
      case Section.Ingredients:
        currentRecipe.ingredients.push(parseIngredients(line));
        return;
      case Section.Steps:
        if (isStepNumber(line) && currentStep) {
          currentRecipe.steps.push(currentStep);
          currentStep = '';
        } else {
          currentStep += (currentStep ? ' ' : '') + line;
        }
        return;
    }

  });

  return result;
}

function isMeal(line: string): boolean {
  return /^УЖИН \d$/.test(line.trim());
}

function isIngredients(line: string): boolean {
  return /^Ингредиенты$/.test(line.trim());
}

function isSteps(line: string): boolean {
  return /^приготовление$/.test(line.trim());
}

function isStepNumber(line: string): boolean {
  return /^\d{1,2}$/.test(line.trim());
}

function isIngredientList(line: string): boolean {
  return /^Список продуктов$/.test(line.trim());
}

function isMenu(line: string): boolean {
  return /^КЛАССИЧЕСКОЕ МЕНЮ$/.test(line.trim());
}

function parseIngredients(line: string): Ingredient {
  const result = /^(.*) - ([+]?\d+([.]\d+)?) (.*)$/.exec(line);

  if (result?.length >= 5) {
    const [, name, amount, , unit] = result;

    if (name && amount && unit) {
      return {
        name: result[1],
        amount: parseFloat(result[2]),
        unit: result[4]
      };
    }
  }

  return {
    name: line
  };
}

function printResult(result: Meal[]): void {
  console.log(`Result contains '${result.length}' meals`);
  result.forEach((meal, mealIndex) => {
    console.log(`\t Meals #${mealIndex + 1} contains '${meal.recipes.length}' recipes and will take '${meal.readyInTime}' of your time`);

    meal.recipes.forEach((recipe, recipeIndex) => {
      console.log(`\t\t Recipe #${recipeIndex + 1} title is '${recipe.title}', it contains '${recipe.steps.length}' steps and '${recipe.ingredients.length}' ingredients`);
    });
  });
}

main().then(
  () => console.log('success')
).catch(
  (err) => console.log('failure', err)
);
