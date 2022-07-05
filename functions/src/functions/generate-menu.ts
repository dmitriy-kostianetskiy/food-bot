import { CloudFunction, pubsub } from 'firebase-functions';

import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { CommunicationService } from '../services/communication.service';
import { SubscriptionService } from '../services/subscription.service';
import { topicFunction } from '../utils';
import { TranslationService } from '../services/translation.service';
import { Language } from '../model';
import { SubscriptionPrinterService } from '../services/subscription-printer.factory';

@Service()
export class GenerateMenuFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
    private readonly translationService: TranslationService,
    private readonly subscriptionPrinterService: SubscriptionPrinterService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return topicFunction('generate-menu', async (message) => {
      await this.handleMessage(message.chatId, message.language);
    });
  }

  private async handleMessage(id: string, language: Language): Promise<void> {
    try {
      this.translationService.setLanguage(language);

      const subscription = await this.subscriptionService.create(id, language);
      const printed = this.subscriptionPrinterService.print(subscription);

      this.communicationService.sendMessageToChat(id, ...printed);
    } catch (error) {
      console.error(`Unable to generate menu for subscriber with id: ${id}`, error);
    }
  }
}
