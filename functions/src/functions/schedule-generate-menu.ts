import { CloudFunction, region } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { PubsubService } from '../services/pubsub.service';
import { Service } from 'typedi';
import { ConfigurationService } from '../services/configuration.service';

@Service()
export class ScheduleGenerateMenuFunctionCreator extends FunctionCreator {
  constructor (
    private messagesService: PubsubService,
    private readonly configurationService: ConfigurationService) {
    super();
  }

  createFunction(): CloudFunction<unknown> {
    return region(this.configurationService.functionRegion)
      .pubsub
      .schedule('every friday 12:00')
      .timeZone('Europe/Moscow')
      .onRun(async () => await this.messagesService.publish('generate-menu'));
  }
}
