import { Inject, Service } from 'typedi';
import { Telegraf, Context, Telegram } from 'telegraf';
import { Update } from 'typegram';
import { ServerResponse } from 'http';
import { Configuration } from '../model';
import { CONFIG_TOKEN } from '../tokens';

@Service()
export class TelegramService {
  @Inject(CONFIG_TOKEN)
  private readonly configuration!: Configuration;

  readonly telegraf: Telegraf<Context> = this.createTelegraf();

  get telegram(): Telegram {
    return this.telegraf.telegram;
  }

  private createTelegraf(): Telegraf<Context> {
    const token = this.configuration.bot?.token;
    if (!token) {
      throw Error('Unable to run bot because bot token is empty');
    }

    return new Telegraf(token);
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

  async handleRequest(body: Update, response: ServerResponse): Promise<void> {
    await this.telegraf.handleUpdate(body, response);
  }
}
