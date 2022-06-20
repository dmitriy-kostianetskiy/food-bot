import * as admin from 'firebase-admin';

import { MenuModel } from '../model/menu-model';
import { Service } from 'typedi';
import { ConfigurationService } from '../services/configuration.service';

@Service()
export class MenuService {
  constructor(
    private readonly firestore: admin.firestore.Firestore,
    private readonly configurationService: ConfigurationService
  ) {}

  async fetchCurrentMenu(): Promise<MenuModel | undefined> {
    const menuDocument = await this.firestore.doc(this.configurationService.menuPath).get();

    return menuDocument.data() as MenuModel;
  }

  async replaceCurrentMenu(menu: MenuModel): Promise<void> {
    await this.firestore.doc(this.configurationService.menuPath).set(menu);
  }
}
