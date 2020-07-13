import React from 'react';
import RecipeForm from '../components/RecipeForm';
import categories from '../mocks/mock-categories';
import { useHistory } from "react-router-dom";
import { RecipeModel } from '../model/recipe-model';
import { firestore } from '../firebase';

export default function CreateRecipeView() {
  const history = useHistory();

  const recipe = {
    ingredients: [
      {
        title: 'ingredient 1'
      }
    ],
    steps: [
      'Step 1',
      'Step 2'
    ],
    readyIn: 15,
    title: 'My new recipe'
  };

  const handleOnSave = async (recipe: RecipeModel) => {
    const create = async () => {
      await firestore.collection('recipes').add(recipe);
      debugger;

      history.push('/');
    };

    create();
  };

  return (
    <RecipeForm
      title="Create recipe"
      recipe={recipe}
      categories={categories}
      onSave={handleOnSave}/>
  );
}
