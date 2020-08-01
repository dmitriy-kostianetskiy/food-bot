import { useEffect, useState } from 'react';
import {  RecipeModel, Fetched, Document, isLoaded } from '../model';
import { firestore } from '../firebase';

export default function useAllRecipes(searchTerm: string): Fetched<Document<RecipeModel>[]>  {
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

  const cleanSearchTerm = searchTerm?.trim();
  if (isLoaded(recipes) && cleanSearchTerm) {
    return recipes.filter(x => x.data.main.title.includes(cleanSearchTerm) || x.data.side?.title?.includes(cleanSearchTerm));
  }

  return recipes;
}
