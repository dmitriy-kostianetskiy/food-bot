
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import { createBot } from './bot-factory';

let bot: Telegraf<ContextMessageUpdate>;

createBot().then(result => bot = result).catch(error => console.log(error));

export function botHook(req, res): Promise<void> {
  try {
    if (bot) {
      return bot.handleUpdate(req.body, res);
    }

    res.status(500);
    res.send('Unable to initialize bot');
  } catch (err) {
    res.status(500);
    res.send(err);
  }
}
