import React from 'react';
import RecipesList from '../components/RecipesList';
import Error from  '../components/Error';

import LinearProgress from '@material-ui/core/LinearProgress';
import useAllRecipes from '../hooks/useAllRecipes';

export default function RecipesView() {
  const recipes = useAllRecipes();

  switch (recipes) {
    case 'loading':
      return (<LinearProgress />);
    case 'error':
      return (<Error />);
    default:
      return (<RecipesList title="Recipes" items={recipes}/>);
  }
}
