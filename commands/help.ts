import { ContextMessageUpdate, Middleware } from 'telegraf';

const MESSAGE = `Этот бот может сгенерировать меню на неделю.`;

export const helpCommand: Middleware<ContextMessageUpdate> = context => {
  context.reply(MESSAGE);
};
