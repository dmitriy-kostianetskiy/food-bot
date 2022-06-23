import { Service } from 'typedi';
import { Telegraf, Context, Telegram } from 'telegraf';
import { ConfigurationService } from './configuration.service';
import { Update } from 'typegram';
import { ServerResponse } from 'http';

@Service()
export class TelegramService {
  readonly telegraf: Telegraf<Context> = this.createTelegraf();

  get telegram(): Telegram {
    return this.telegraf.telegram;
  }

  constructor(private readonly configurationService: ConfigurationService) {}

  private createTelegraf(): Telegraf<Context> {
    if (!this.configurationService.botToken) {
      throw Error('Unable to run bot because bot token is empty');
    }

    return new Telegraf(this.configurationService.botToken);
  }

  // configure(): void {
  //   if (this.configurationService.isEmulator) {
  //     console.log(111111);
  //     this.telegraf.launch();
  //   } else {
  //     this.telegram.setWebhook(
  //       `https://${this.configurationService.functionRegion}-generate-menu.cloudfunctions.net/telegramBotHook`,
  //     );
  //   }
  // }

  async sendHtml(chatId: string, html: string): Promise<void> {
    await this.telegram.sendMessage(chatId, html, { parse_mode: 'HTML' });
  }

  async sendText(chatId: string, text: string): Promise<void> {
    await this.telegram.sendMessage(chatId, text);
  }

  async handleRequest(body: Update, response: ServerResponse): Promise<void> {
    await this.telegraf.handleUpdate(body, response);
  }
}
