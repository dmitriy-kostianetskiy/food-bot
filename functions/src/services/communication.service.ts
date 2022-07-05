import { Service } from 'typedi';
import { TelegramService } from './telegram.service';
import { TranslationService } from './translation.service';

@Service()
export class CommunicationService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly translationService: TranslationService,
  ) {}

  async sendMessageToChat(chatId: string, ...messages: string[]): Promise<void> {
    if (messages.length === 0) {
      return;
    }

    for (const item of messages) {
      await this.telegramService.sendHtml(chatId, item);
    }
  }

  async sendErrorMessage(chatId: string): Promise<void> {
    await this.telegramService.sendHtml(chatId, this.translationService.get('error'));
  }

  async sendThankYouMessage(chatId: string): Promise<void> {
    await this.telegramService.sendHtml(chatId, this.translationService.get('thankYou'));
  }

  async sendGoodByeMessage(chatId: string): Promise<void> {
    await this.telegramService.sendHtml(chatId, this.translationService.get('goodBye'));
  }
}
