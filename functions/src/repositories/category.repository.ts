import * as admin from 'firebase-admin';

import { CategoryModel } from '../model/category-model';
import { Service } from 'typedi';

@Service()
export class CategoryRepository {
  constructor(private firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<readonly CategoryModel[]> {
    const result = await this.firestore.collection('categories').get();

    if (result.empty) {
      throw new Error('Unable to retrieve categories');
    }

    return result.docs.map((item) => ({
      id: item.id,
      ...(item.data() as CategoryModel),
    }));
  }
}
