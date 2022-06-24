import * as admin from 'firebase-admin';

import { RecipeModel } from '../model';
import { Service } from 'typedi';

@Service()
export class RecipeRepository {
  private get collection(): admin.firestore.CollectionReference<RecipeModel> {
    return this.firestore.collection('recipes') as admin.firestore.CollectionReference<RecipeModel>;
  }

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<readonly RecipeModel[]> {
    const result = await this.collection.get();

    if (result.empty) {
      throw new Error('Unable to retrieve recipes');
    }

    return result.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    }));
  }
}
