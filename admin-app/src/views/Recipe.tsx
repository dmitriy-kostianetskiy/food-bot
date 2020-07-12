import React from 'react';
import RecipeForm from '../components/RecipeForm';
import recipes from '../mocks/mock-recipes';
import categories from '../mocks/mock-categories';
import { useParams, useHistory } from "react-router-dom";
import { RecipeModel } from '../model/recipe-model';

let myRecipes = [...recipes];

export default function Recipe() {
  const { id } = useParams();
  const history = useHistory();

  const recipe = recipes[id];

  const handleOnDelete = (recipe: RecipeModel) => {
    myRecipes = myRecipes.filter(item => item !== recipe);

    history.push('/');
  };

  const handleOnSave = (recipe: RecipeModel) => {
    myRecipes = myRecipes.map(item => {
      if (item === recipe) {
        return recipe;
      }

      return item;
    });

    history.push('/');
  };

  return (
    <RecipeForm
      title="Edit recipe"
      recipe={recipe}
      categories={categories}
      onDelete={handleOnDelete}
      onSave={handleOnSave}/>
  );
}
