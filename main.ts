
import { createBot } from './bot-factory';

const bot = createBot();

export function botHook(req, res): Promise<void> {
  return bot.handleUpdate(req.body, res);
}
