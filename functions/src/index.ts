import 'reflect-metadata';

import bootstrap from './bootstrap';
import { GenerateMenuFunctionCreator } from './functions/generate-menu';
import { ScheduleGenerateMenuFunctionCreator } from './functions/schedule-generate-menu';
import { TelegramBotHookFunctionCreator } from './functions/telegram-bot-hook';

const createFunction = bootstrap();

export const publishMenuToSubscriber = createFunction(GenerateMenuFunctionCreator);
export const scheduleGenerateMenu = createFunction(ScheduleGenerateMenuFunctionCreator);
export const telegramBotHook = createFunction(TelegramBotHookFunctionCreator);
