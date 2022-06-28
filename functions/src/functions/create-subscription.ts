import { CloudFunction, pubsub } from 'firebase-functions';
import { FunctionCreator } from './function-creator';
import { Service } from 'typedi';
import { SubscriptionService } from '../services/subscription.service';
import { CommunicationService } from '../services/communication.service';
import { topicFunction } from '../utils';
import { Language } from '../model';
import { TranslationService } from '../services/translation.service';

@Service()
export class CreateSubscriptionFunctionCreator extends FunctionCreator {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
    private readonly translationService: TranslationService,
  ) {
    super();
  }

  createFunction(): CloudFunction<pubsub.Message> {
    return topicFunction('create-subscription', async (message) => {
      await this.createSubscription(message.id, message.language);
    });
  }

  private async createSubscription(id: string, language: Language): Promise<void> {
    try {
      this.translationService.setLanguage(language);

      const subscription = await this.subscriptionService.create(id, language);

      await this.communicationService.sendMessageToChat(id, ...subscription.printed);
    } catch (error) {
      await this.communicationService.sendErrorMessage(id);
      throw error;
    }
  }
}
