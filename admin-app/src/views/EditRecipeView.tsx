import React, {  } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { RecipeModel } from '../model';
import { firestore } from '../firebase';
import { LinearProgress, Box, Container, Button, makeStyles, Theme, createStyles } from '@material-ui/core';
import RecipeForm from '../components/RecipeForm';
import useCategories from '../hooks/useCategories';
import useRecipe from '../hooks/useRecipe';
import Error from '../components/Error';
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

export default function EditRecipeView() {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const categories = useCategories();
  const [recipe, setRecipe] = useRecipe(id);

  useTitle(typeof recipe === 'object' ? recipe?.main?.title : undefined);

  const handleOnDelete = () => {
    const deleteRecipe = async () => {
      await firestore.collection('recipes').doc(id).delete();

      history.push('/');
    };

    deleteRecipe();
  };

  const handleOnSave: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (typeof recipe === 'object') {
      const saveRecipe = async () => {
        await firestore.collection('recipes').doc(id).set(recipe, { merge: true });

        history.push('/');
      };

      saveRecipe();
    }
  };

  switch (recipe) {
    case 'loading':
      return (<LinearProgress />);
    case 'error':
      return (<Error />);
    default:
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
              form="recipe-form"
              onClick={handleOnDelete}>
              Delete
            </Button>
          </Box>
        </Container>
      );
  }
}
