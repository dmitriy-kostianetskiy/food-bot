import { Service } from 'typedi';
import { PubsubService } from './pubsub.service';

@Service()
export class CommunicationService {
  constructor(private readonly pubsubService: PubsubService) {}

  async sendMessage(subscriberId: string, ...messages: string[]): Promise<void> {
    await this.pubsubService.publish('bot-messages', {
      subscriberId,
      messages,
    });
  }

  async sendErrorMessage(subscriberId: string): Promise<void> {
    await this.sendMessage(subscriberId, 'Что-то пошло не так!');
  }
}
