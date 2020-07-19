import * as admin from 'firebase-admin';

import { RecipeModel } from '../model';
import { Service } from 'typedi';

@Service()
export default class RecipeService {
  constructor(private firestore: admin.firestore.Firestore) {}

  async fetchAll(): Promise<RecipeModel[]> {
    const result = await this.firestore.collection('recipes').get();

    return result.docs.map(item => ({
      id: item.id,
      ...item.data() as RecipeModel
    }));
  }
}
