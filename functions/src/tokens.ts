import { Token } from 'typedi';
import { Configuration } from './model/configuration';

export const CONFIG_TOKEN = new Token<Configuration>('CONFIG_TOKEN');
