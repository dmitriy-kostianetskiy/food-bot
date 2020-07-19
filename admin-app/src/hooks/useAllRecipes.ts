import { useEffect, useState } from 'react';
import {  RecipeModel, Fetched, Document } from '../model';
import { firestore } from '../firebase';

export default function useAllRecipes(): Fetched<Document<RecipeModel>[]>  {
  const [recipes, setRecipes] = useState<Fetched<Document<RecipeModel>[]>>('loading');

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await firestore.collection(`recipes`).orderBy('main.title').get();
        const model = result.docs.map(item => ({
          id: item.id,
          data: item.data() as RecipeModel
        }));
  
        setRecipes(model);
      } catch (error) {
        if (error.code === 'permission-denied') {
          setRecipes('forbidden');
        } else {
          setRecipes('error');
        }
      }
    }
  
    fetch();
  }, []);

  return recipes;
}
