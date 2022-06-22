import { Service } from 'typedi';
import { Configuration } from '../model';
import * as functions from 'firebase-functions';

@Service()
export class ConfigurationService {
  readonly botToken?: string;

  constructor() {
    const configuration = this.readConfiguration();

    this.botToken = configuration?.bot?.token;
  }

  private readConfiguration(): Configuration {
    return (functions.config() as Configuration) || {};
  }
}
