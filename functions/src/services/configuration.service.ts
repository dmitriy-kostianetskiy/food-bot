
import { Service } from 'typedi';
import { Configuration } from '../model';
import * as functions from 'firebase-functions';

@Service()
export class ConfigurationService {
  readonly botToken?: string;
  readonly functionRegion: string;
  readonly menuPath: string;
  readonly subscriptionsPath: string;
  
  constructor() {
    const configuration = this.readConfiguration();

    this.botToken = configuration?.bot?.token;
    this.functionRegion = configuration?.function?.region || 'europe-west3';
    this.menuPath = configuration?.menu?.path || 'menu/current';
    this.subscriptionsPath = configuration?.subscriptions?.path || 'subscriptions';
  }

  private readConfiguration(): Configuration {
    return functions.config() as Configuration || {};
  }
}
