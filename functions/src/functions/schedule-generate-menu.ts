import { CloudFunction, region } from 'firebase-functions'

import { DEFAULT_REGION } from '../constants'
import { FunctionCreator } from './function-creator'
import { PubsubService } from '../services/pubsub.service'
import { Service } from 'typedi'

@Service()
export default class ScheduleGenerateMenuFunctionCreator extends FunctionCreator {
  constructor (private messagesService: PubsubService) {
    super()
  }

  createFunction(): CloudFunction<unknown> {
    return region(DEFAULT_REGION)
      .pubsub
      .schedule('every friday 12:00')
      .timeZone('Europe/Moscow')
      .onRun(async () => await this.messagesService.publish('generate-menu'))
  }
}
