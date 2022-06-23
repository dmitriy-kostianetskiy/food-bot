import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { MenuService } from '../services/menu.service';

@Service()
export class ScheduleGenerateMenuFunctionCreator extends FunctionCreator {
  constructor(private readonly menuService: MenuService) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return pubsub
      .schedule('every friday 12:00')
      .timeZone('Europe/Moscow')
      .onRun(async () => await this.menuService.generateNew());
  }
}
