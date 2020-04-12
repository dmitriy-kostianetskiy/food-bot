import { Menu } from '../model';

export class MenuService {
  readonly CURRENT_MENU_PATH = 'menu/currentMenu';

  constructor(private db: FirebaseFirestore.Firestore) {}

  async fetchCurrentMenu(): Promise<Menu | undefined> {
    const menuDocument = await this.db.doc(this.CURRENT_MENU_PATH).get();

    return menuDocument.data() as Menu;
  }

  async replaceCurrentMenu(menu: Menu): Promise<void> {
    await this.db.doc(this.CURRENT_MENU_PATH).set(menu);
  }
}
