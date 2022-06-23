import 'reflect-metadata';

import bootstrap from './bootstrap';
import { CreateSubscriptionFunctionCreator } from './functions/create-subscription';
import { GenerateMenuFunctionCreator } from './functions/generate-menu';
import { RemoveSubscriptionFunctionCreator } from './functions/remove-subscription';
import { ScheduleGenerateMenuFunctionCreator } from './functions/schedule-generate-menu';
import { TelegramBotHookFunctionCreator } from './functions/telegram-bot-hook';
import { TelegramSendMessageFunctionCreator } from './functions/telegram-send-message';

const createFunction = bootstrap();

export const publishMenuToSubscriber = createFunction(GenerateMenuFunctionCreator);
export const scheduleGenerateMenu = createFunction(ScheduleGenerateMenuFunctionCreator);
export const telegramBotHook = createFunction(TelegramBotHookFunctionCreator);
export const telegramSendMessage = createFunction(TelegramSendMessageFunctionCreator);
export const createSubscription = createFunction(CreateSubscriptionFunctionCreator);
export const removeSubscription = createFunction(RemoveSubscriptionFunctionCreator);
