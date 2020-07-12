import React from 'react';
import RecipeList from '../components/RecipeList';
import recipes from '../mocks/mock-recipes';

export default function Home() {
  return (
    <RecipeList
      title="Recipes"
      items={recipes}/>
  );
}
