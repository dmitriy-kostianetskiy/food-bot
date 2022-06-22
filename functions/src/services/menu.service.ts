import * as admin from 'firebase-admin';

import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';

@Service()
export class MenuService {
  static readonly currentMenuPath = 'menu/current';

  constructor(private readonly firestore: admin.firestore.Firestore) {}

  async fetchCurrentMenu(): Promise<MenuModel | undefined> {
    const menuDocument = await this.firestore.doc(MenuService.currentMenuPath).get();

    if (menuDocument.exists) {
      return menuDocument.data() as MenuModel;
    }

    return undefined;
  }

  async replaceCurrentMenu(menu: MenuModel): Promise<void> {
    await this.firestore.doc(MenuService.currentMenuPath).set(menu);
  }
}
