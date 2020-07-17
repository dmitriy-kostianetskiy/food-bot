import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RecipeModel } from '../model';
import { firestore } from '../firebase';
import { Container, Box, Button, makeStyles, Theme, createStyles } from '@material-ui/core';
import RecipeForm from '../components/RecipeForm';
import { createMeal } from '../recipe.helper';
import useCategories from '../hooks/useCategories';
import { Link } from 'react-router-dom';
import useTitle from '../hooks/useTitle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    box: {
      padding: theme.spacing(1),
      '& > button': {
        marginRight: theme.spacing(1),
      }
    }
  })
);

export default function CreateRecipeView() {
  const classes = useStyles();
  const history = useHistory();

  const categories = useCategories();
  const [recipe, setRecipe] = useState<RecipeModel>({
    main: createMeal()
  });

  useTitle(recipe ? recipe?.main?.title : 'Create new recipe');

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
      <Box className={classes.box}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          form="recipe-form">
          Save
        </Button>
        <Button
          variant="contained"
          color="secondary"
          component={Link}
          to="/">
          Cancel
        </Button>
      </Box>
    </Container>
  );
}
