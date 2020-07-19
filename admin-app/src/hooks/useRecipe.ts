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
        if (error.code === 'permission-denied') {
          setRecipe('forbidden');
        } else {
          setRecipe('error');
        }
      }
    }
  
    fetch();
  }, [id]);

  return [recipe, setRecipe];
}
