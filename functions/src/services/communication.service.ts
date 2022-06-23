import { Service } from 'typedi';
import { PubsubService } from './pubsub.service';

@Service()
export class CommunicationService {
  constructor(private readonly pubsubService: PubsubService) {}

  async sendMessage(chatId: string, ...messages: string[]): Promise<void> {
    await this.pubsubService.publish('telegram-bot-messages', {
      chatId: chatId,
      messages,
    });
  }

  async sendErrorMessage(chatId: string): Promise<void> {
    await this.sendMessage(chatId, 'Что-то пошло не так!');
  }
}
