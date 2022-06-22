import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';

@Service()
export class ScheduleGenerateMenuFunctionCreator extends FunctionCreator {
  constructor(private readonly messagesService: PubsubService) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return pubsub
      .schedule('every friday 12:00')
      .timeZone('Europe/Moscow')
      .onRun(async () => await this.messagesService.publish('generate-menu'));
  }
}
