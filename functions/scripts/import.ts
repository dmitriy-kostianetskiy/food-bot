import * as categoriesData from './categories.json';
import * as recipesData from './recipes.json';

import { admin } from 'firestore-export-import';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://generate-menu.firebaseio.com',
});

const firestore = admin.firestore();

async function uploadCategories() {
  const batch = admin.firestore().batch();
  categoriesData.forEach((category) => {
    const docRef = firestore.collection('categories').doc();
    batch.create(docRef, {
      title: category.name,
      ingredients: category.titles,
    });
  });

  await batch.commit();
}

function transformMeal(meal) {
  return {
    main: transformRecipe(meal.recipes[0]),
    side: transformRecipe(meal.recipes[1]),
    readyIn: meal.readyInTime,
  };
}

function transformRecipe(meal) {
  if (!meal) {
    return null;
  }

  return {
    title: meal.title,
    steps: meal.steps,
    ingredients: meal.ingredients.map((item) => ({
      amount: item.amount || null,
      title: item.name,
      unit: item.unit || null,
    })),
  };
}

async function uploadRecipes() {
  const batch = admin.firestore().batch();

  recipesData.forEach((meal) => {
    const docRef = firestore.collection('recipes').doc();

    batch.create(docRef, transformMeal(meal));
  });

  await batch.commit();
}

async function upload() {
  await uploadCategories();
  await uploadRecipes();
}

upload()
  .then((text) => {
    console.log(text);
  })
  .catch((err) => {
    console.error(err);
  });
