import 'reflect-metadata';

import bootstrap from './bootstrap';
import { GenerateMenuHttpFunctionCreator } from './functions/generate-menu-http';
import { PublishMenuToAllFunctionCreator } from './functions/publish-menu-to-all';
import { PublishMenuToSubscriberFunctionCreator } from './functions/publish-menu-to-subscriber';
import { ScheduleGenerateMenuFunctionCreator } from './functions/schedule-generate-menu';
import { TelegramBotHookFunctionCreator } from './functions/telegram-bot-hook';
import { TelegramSendMessageFunctionCreator } from './functions/telegram-send-message';

const createFunction = bootstrap();

export const generateMenuHttps = createFunction(GenerateMenuHttpFunctionCreator);
export const publishMenuToAll = createFunction(PublishMenuToAllFunctionCreator);
export const publishMenuToSubscriber = createFunction(PublishMenuToSubscriberFunctionCreator);
export const scheduleGenerateMenu = createFunction(ScheduleGenerateMenuFunctionCreator);
export const telegramBotHook = createFunction(TelegramBotHookFunctionCreator);
export const telegramSendMessage = createFunction(TelegramSendMessageFunctionCreator);
