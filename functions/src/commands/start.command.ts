import { Service } from 'typedi';
import { TelegramCustomContext } from '../model';
import { TelegramCommand } from '../model/telegram/command';
import { PubsubService } from '../services/pubsub.service';
import { CommunicationService } from '../services/communication.service';
import { COMMANDS_TOKEN } from '../tokens';

@Service({
  id: COMMANDS_TOKEN,
  multiple: true,
})
export class StartCommand implements TelegramCommand {
  readonly command = 'start';

  constructor(
    private readonly communicationService: CommunicationService,
    private readonly pubsubService: PubsubService,
  ) {}

  async handler({ chatId, language }: TelegramCustomContext): Promise<void> {
    try {
      this.pubsubService.publish('generate-menu', { chatId, language });

      await this.communicationService.sendThankYouMessage(chatId);
    } catch (error) {
      await this.communicationService.sendErrorMessage(chatId);
      throw error;
    }
  }
}
