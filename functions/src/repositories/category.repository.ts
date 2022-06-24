import * as admin from 'firebase-admin';

import { CategoryModel } from '../model/category-model';
import { Service } from 'typedi';

@Service()
export class CategoryRepository {
  private get collection(): admin.firestore.CollectionReference<CategoryModel> {
    return this.firestore.collection(
      'categories',
    ) as admin.firestore.CollectionReference<CategoryModel>;
  }

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<readonly CategoryModel[]> {
    const result = await this.collection.get();

    if (result.empty) {
      throw new Error('Unable to retrieve categories');
    }

    return result.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
  }
}
