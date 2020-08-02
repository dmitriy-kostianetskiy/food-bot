import * as admin from 'firebase-admin'

import { MENU_PATH } from '../constants'
import { MenuModel } from '../model/menu-model'
import { Service } from 'typedi'

@Service()
export class MenuService {
  constructor(private firestore: admin.firestore.Firestore) {}

  async fetchCurrentMenu(): Promise<MenuModel | undefined> {
    const menuDocument = await this.firestore.doc(MENU_PATH).get()

    return menuDocument.data() as MenuModel
  }

  async replaceCurrentMenu(menu: MenuModel): Promise<void> {
    await this.firestore.doc(MENU_PATH).set(menu)
  }
}
