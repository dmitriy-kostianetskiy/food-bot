import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { Fetched, RecipeModel } from '../model';
import { firestore } from '../firebase';
import { CircularProgress, Box, Container, Button, makeStyles, Theme, createStyles } from '@material-ui/core';
import RecipeForm from '../components/RecipeForm';
import useCategories from '../hooks/useCategories';

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
  const [recipe, setRecipe] = useState<Fetched<RecipeModel>>('loading');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await firestore.doc(`recipes/${id}`).get();
        const model = result.data() as RecipeModel;

        setRecipe(model || 'error');
      } catch (error) {
        console.error(error);

        setRecipe('error')
      }
    }

    fetchRecipe();
  }, [id]);

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
      return (<CircularProgress />);
    case 'error':
      return (
        <Box>
          Unable to load
        </Box>
      );
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
            {
              <Button
                variant="contained"
                color="secondary"
                form="recipe-form"
                onClick={handleOnDelete}>
                Delete
              </Button>
            }
          </Box>
        </Container>
      );
  }
}
