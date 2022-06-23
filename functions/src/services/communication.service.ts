import { Service } from 'typedi';
import { PubsubService } from './pubsub.service';
import { TelegramService } from './telegram.service';

@Service()
export class CommunicationService {
  constructor(
    private readonly pubsubService: PubsubService,
    private readonly telegramService: TelegramService,
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
    await this.sendMessageToChat(chatId, 'Что-то пошло не так!');
  }

  async sendThankYouMessage(chatId: string): Promise<void> {
    await this.sendMessageToChat(
      chatId,
      'Спасибо! Вы будете получать новое меню каждую пятницу в 12:00 по московскому времени 🍽',
    );
  }

  async sendGoodByeMessage(chatId: string): Promise<void> {
    await this.sendMessageToChat(chatId, 'Нам очень жаль, что Вы нас покидаете 😿');
  }
}
