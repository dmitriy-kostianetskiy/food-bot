import { CloudFunction, region } from 'firebase-functions'

import { DEFAULT_REGION } from '../constants'
import { FunctionCreator } from './function-creator'
import { MenuGeneratorService } from '../services/menu-generator.service'
import { MenuService } from '../services/menu.service'
import { Service } from 'typedi'

@Service()
export default class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor (
    private menuGenerator: MenuGeneratorService,
    private menuService: MenuService
  ) {
    super()
  }

  createFunction(): CloudFunction<unknown> {
    return region(DEFAULT_REGION)
      .pubsub
      .topic('generate-menu')
      .onPublish(async () => {
        const menu = await this.menuGenerator.generate()

        await this.menuService.replaceCurrentMenu(menu)
      })
  }
}
