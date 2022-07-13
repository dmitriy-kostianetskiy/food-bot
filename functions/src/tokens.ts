import { Token } from 'typedi';
import { TelegramCommand } from './model/telegram/command';

export const COMMANDS_TOKEN = new Token<TelegramCommand>('TELEGRAM_COMMANDS');
