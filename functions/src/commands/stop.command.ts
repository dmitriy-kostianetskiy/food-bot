import { Service } from 'typedi';
import { TelegramCustomContext } from '../model';
import { CommunicationService } from '../services/communication.service';
import { SubscriptionService } from '../services/subscription.service';
import { TelegramCommand } from '../model/telegram/command';
import { COMMANDS_TOKEN } from '../tokens';

@Service({
  id: COMMANDS_TOKEN,
  multiple: true,
})
export class StopCommand implements TelegramCommand {
  readonly command = 'stop';

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly communicationService: CommunicationService,
  ) {}

  async handler({ chatId }: TelegramCustomContext): Promise<void> {
    try {
      await this.subscriptionService.remove(chatId);

      await this.communicationService.sendGoodByeMessage(chatId);
    } catch (error) {
      await this.communicationService.sendErrorMessage(chatId);
      throw error;
    }
  }
}
