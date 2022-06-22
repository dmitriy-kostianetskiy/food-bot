import { Service } from 'typedi';
import { Configuration } from '../model';
import * as functions from 'firebase-functions';

@Service()
export class ConfigurationService {
  readonly isEmulator: boolean = true;
  readonly botToken?: string;

  constructor() {
    console.log('fuck fuck ');
    const configuration = this.readConfiguration();

    console.log(configuration);

    this.botToken = configuration?.bot?.token;
  }

  private readConfiguration(): Configuration {
    return (functions.config() as Configuration) || {};
  }
}
