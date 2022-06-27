import { Service } from 'typedi';
import { Languages, TranslationDictionary, TranslationKey } from '../model';
import { TRANSLATION_DICTIONARIES } from '../translations/all';

@Service()
export class TranslationService {
  private currentLanguage: Languages = 'en';
  private get currentDictionary(): TranslationDictionary {
    return TRANSLATION_DICTIONARIES[this.currentLanguage];
  }

  get(key: TranslationKey): string {
    return this.currentDictionary[key];
  }

  setLanguage(language: Languages): void {
    this.currentLanguage = language;
  }
}
