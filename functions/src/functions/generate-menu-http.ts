import { region, HttpsFunction } from 'firebase-functions'

import { DEFAULT_REGION } from '../constants'
import { FunctionCreator } from './function-creator'
import { Service } from 'typedi'
import { PubsubService } from '../services/pubsub.service'
import * as cors from 'cors'

@Service()
export default class GenerateMenuHttpFunctionCreator extends FunctionCreator {
  private cors = cors({
    origin: [
      'https://generate-menu.web.app',
      'https://generate-menu.firebaseapp.com'
    ]
  })

  constructor (private messagesService: PubsubService) {
    super()
  }

  createFunction(): HttpsFunction {
    return region(DEFAULT_REGION)
      .https
      .onRequest(async (request, response) => this.cors(request, response, async () => {
        try {
          await this.messagesService.publish('generate-menu')

          response.status(200).send('Success!')
        } catch (e) {
          console.error(e)

          response.status(500).send('Error!')
        }
      }))
  }
}
