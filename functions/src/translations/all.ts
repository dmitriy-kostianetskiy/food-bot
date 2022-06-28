import { TranslationDictionary, Language } from '../model';
import { TRANSLATION_DICTIONARY_EN } from './en';
import { TRANSLATION_DICTIONARY_RU } from './ru';

export const TRANSLATION_DICTIONARIES: Record<Language, TranslationDictionary> = {
  ru: TRANSLATION_DICTIONARY_RU,
  en: TRANSLATION_DICTIONARY_EN,
};
