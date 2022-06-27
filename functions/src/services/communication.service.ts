import { Service } from 'typedi';
import { PubsubService } from './pubsub.service';
import { TelegramService } from './telegram.service';
import { TranslationService } from './translation.service';

@Service()
export class CommunicationService {
  constructor(
    private readonly pubsubService: PubsubService,
    private readonly telegramService: TelegramService,
    private readonly translationService: TranslationService,
  ) {}

  async sendMessageToChat(chatId: string, ...messages: string[]): Promise<void> {
    if (messages.length === 0) {
      return;
    }

    if (messages.length === 1) {
      const [message] = messages;

      return await this.telegramService.sendHtml(chatId, message);
    }

    await this.pubsubService.publish('telegram-bot-messages', {
      chatId,
      messages,
    });
  }

  async sendErrorMessage(chatId: string): Promise<void> {
    await this.sendMessageToChat(chatId, this.translationService.get('error'));
  }

  async sendThankYouMessage(chatId: string): Promise<void> {
    await this.sendMessageToChat(chatId, this.translationService.get('thankYou'));
  }

  async sendGoodByeMessage(chatId: string): Promise<void> {
    await this.sendMessageToChat(chatId, this.translationService.get('goodBye'));
  }
}
