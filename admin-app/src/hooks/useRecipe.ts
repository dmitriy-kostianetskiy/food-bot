import { useEffect, useState } from 'react';
import {  RecipeModel, Fetched, } from '../model';
import { firestore } from '../firebase';

export default function useRecipe(id: string): [Fetched<Fetched<RecipeModel>>, React.Dispatch<Fetched<RecipeModel>>] {
  const [recipe, setRecipe] = useState<Fetched<RecipeModel>>('loading');

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await firestore.doc(`recipes/${id}`).get();
        const model = result.data() as RecipeModel;

        setRecipe(model || 'error');

      } catch (error) {
        console.error(error);
  
        setRecipe('error');
      }
    }
  
    fetch();
  }, [id]);

  return [recipe, setRecipe];
}
