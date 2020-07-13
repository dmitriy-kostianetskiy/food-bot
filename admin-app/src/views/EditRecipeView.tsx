import React, { useState, useEffect } from 'react';
import RecipeForm from '../components/RecipeForm';
import categories from '../mocks/mock-categories';
import { useParams, useHistory } from "react-router-dom";
import { RecipeModel } from '../model/recipe-model';
import { Fetched } from '../model/state';
import { firestore } from '../firebase';
import { CircularProgress, Box } from '@material-ui/core';

export default function EditRecipeView() {
  const { id } = useParams();
  const history = useHistory();

  const [recipe, setRecipe] = useState<Fetched<RecipeModel>>('loading');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const result = await firestore.doc(`recipes/${id}`).get();
        const model = result.data() as RecipeModel;

        setRecipe(model || 'error');
      } catch (error) {
        console.log(error);

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

  const handleOnSave = (recipe: RecipeModel) => {
    const saveRecipe = async () => {
      debugger;
      await firestore.collection('recipes').doc(id).set(recipe, { merge: true });

      history.push('/');
    };

    saveRecipe();
  };

  switch (recipe) {
    case 'loading':
      return (<CircularProgress />);
    case 'error':
      return (
        <Box>
          Unable to load reciep
        </Box>
      );
    default:
      return (
        <RecipeForm
          title="Edit recipe"
          recipe={recipe}
          categories={categories}
          onDelete={handleOnDelete}
          onSave={handleOnSave}/>
      );
  }
}
