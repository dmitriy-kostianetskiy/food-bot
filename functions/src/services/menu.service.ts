import { MenuModel } from '../model';

export class MenuService {
  readonly CURRENT_MENU_PATH = 'menu/currentMenu';

  constructor(private db: FirebaseFirestore.Firestore) {}

  async fetchCurrentMenu(): Promise<MenuModel | undefined> {
    const menuDocument = await this.db.doc(this.CURRENT_MENU_PATH).get();

    return menuDocument.data() as MenuModel;
  }

  async replaceCurrentMenu(menu: MenuModel): Promise<void> {
    await this.db.doc(this.CURRENT_MENU_PATH).set(menu);
  }
}
