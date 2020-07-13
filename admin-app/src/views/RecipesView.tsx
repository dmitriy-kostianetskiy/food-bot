import React, { useState, useEffect } from 'react';
import RecipeList from '../components/RecipeList';
import { RecipeModel } from '../model/recipe-model';
import { firestore } from '../firebase';
import { CircularProgress, Box } from '@material-ui/core';
import { Fetched } from '../model/state';

export default function RecipesView() {
  const [recipes, setRecipes] = useState<Fetched<{ id: string, data: RecipeModel }[]>>('loading');
 
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const result = await firestore.collection('recipes').get();
        const recipes = result.docs.map(item => ({
          id: item.id,
          data: item.data() as RecipeModel
        }));

        setRecipes(recipes);
      } catch (error) {
        console.error(error);

        setRecipes('error');
      }
    }

    fetchRecipes();
  }, []);

  switch (recipes) {
    case 'loading':
      return (<CircularProgress />);
    case 'error':
      return (
        <Box>
          Unable to load
        </Box>
      );
    default:
      return (
        <RecipeList
        title="Recipes"
        items={recipes}/>
      );
  }
}
