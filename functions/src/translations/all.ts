import { Languages, TranslationDictionary } from '../model/translations';
import { TRANSLATION_DICTIONARY_EN } from './en';
import { TRANSLATION_DICTIONARY_RU } from './ru';

export const TRANSLATION_DICTIONARIES: Record<Languages, TranslationDictionary> = {
  ru: TRANSLATION_DICTIONARY_RU,
  en: TRANSLATION_DICTIONARY_EN,
};
