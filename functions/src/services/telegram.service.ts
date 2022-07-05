import { Service } from 'typedi';
import { Telegraf } from 'telegraf';
import { Update } from 'typegram';
import { ServerResponse } from 'http';
import {
  TelegramCommand,
  TelegramCustomContext,
  TelegramErrorMiddleware,
  TelegramMiddleware,
  TelegramText,
} from '../model';

@Service()
export class TelegramService {
  private _telegraf?: Telegraf<TelegramCustomContext>;

  private get telegraf(): Telegraf<TelegramCustomContext> {
    if (!this._telegraf) {
      this._telegraf = this.createTelegraf();
    }

    return this._telegraf;
  }

  private createTelegraf(): Telegraf<TelegramCustomContext> {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      throw Error('Unable to run bot because bot token is empty');
    }

    return new Telegraf(token);
  }

  command(...commands: TelegramCommand[]): void {
    console.log(`Register Commands ${commands.length}`);

    commands.forEach((command) => {
      console.log(`Register Command ${command.command}`);

      this.telegraf.command(command.command, async (context) => await command.handler(context));

      console.log(`Command ${command.command} registered`);
    });
  }

  use(middleware: TelegramMiddleware): void {
    this.telegraf.use(async (context, next) => await middleware(context, next));
  }

  catch(middleware: TelegramErrorMiddleware): void {
    this.telegraf.catch(async (error, context) => await middleware(error, context));
  }

  text(middleware: TelegramText): void {
    this.telegraf.on('text', async (context) => await middleware(context));
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
    await this.telegraf.telegram.sendMessage(chatId, html, { parse_mode: 'HTML' });
  }

  async handleRequest(body: Update, response: ServerResponse): Promise<void> {
    await this.telegraf.handleUpdate(body, response);
  }
}
