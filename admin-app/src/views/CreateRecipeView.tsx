import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RecipeModel } from '../model';
import { firestore } from '../firebase';
import { Container, Box, Button } from '@material-ui/core';
import RecipeForm from '../components/RecipeForm';
import { createMeal } from '../recipe.helper';
import useCategories from '../hooks/useCategories';

export default function CreateRecipeView() {
  const history = useHistory();

  const categories = useCategories();
  const [recipe, setRecipe] = useState<RecipeModel>({
    main: createMeal()
  });

  const handleOnSave: React.FormEventHandler = (event) => {
    event.preventDefault();

    const create = async () => {
      await firestore.collection('recipes').add(recipe);

      history.push('/');
    };

    create();
  };

  return (
    <Container>
      <form id="recipe-form" onSubmit={handleOnSave}>
      </form>
      <RecipeForm
        categories={categories}
        recipe={recipe}
        onChange={(recipe: RecipeModel) => setRecipe(recipe)} />
      <Box>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          form="recipe-form">
          Save
        </Button>
      </Box>
    </Container>
  );
}
