import { useEffect, useState } from 'react';
import { CategoryModel } from '../model';
import { firestore } from '../firebase';

export default function useCategories(): CategoryModel[]  {
  const [categories, setCategories] = useState<CategoryModel[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const result = await firestore.collection(`categories`).get();
        const model = result.docs.map(item => item.data() as CategoryModel);
  
        setCategories(model);
      } catch (error) {
        setCategories([]);
      }
    }
  
    fetch();
  }, []);

  return categories;
}
