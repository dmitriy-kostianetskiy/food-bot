import * as admin from 'firebase-admin';

import { CategoryModel } from '../model/category-model';
import { Service } from 'typedi';

@Service()
export class CategoryService {
  constructor(private firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<CategoryModel[]> {
    const result = await this.firestore.collection('categories').get();

    return result.docs.map(item => ({
      id: item.id,
      ...item.data() as CategoryModel
    }));
  }
}
