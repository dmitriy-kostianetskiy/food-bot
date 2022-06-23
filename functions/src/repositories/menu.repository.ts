import * as admin from 'firebase-admin';

import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';

@Service()
export class MenuRepository {
  static readonly currentMenuPath = 'menu/current';

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async fetchCurrentMenu(): Promise<MenuModel> {
    const menuDocument = await this.firestore.doc(MenuRepository.currentMenuPath).get();

    if (!menuDocument.exists) {
      throw new Error('Unable to retrieve menu');
    }

    return menuDocument.data() as MenuModel;
  }

  async replaceCurrentMenu(menu: MenuModel): Promise<void> {
    await this.firestore.doc(MenuRepository.currentMenuPath).set(menu);
  }
}
