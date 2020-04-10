
import { createBot } from './bot-factory';

const bot = createBot();

export function main(req, res): Promise<void> {
  return bot.handleUpdate(req.body, res);
}
