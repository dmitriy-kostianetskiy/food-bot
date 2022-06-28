import { Service } from 'typedi';
import { Language, TranslationDictionary, TranslationKey } from '../model';
import { TRANSLATION_DICTIONARIES } from '../translations/all';

@Service()
export class TranslationService {
  private currentLanguage: Language = 'en';
  private get currentDictionary(): TranslationDictionary {
    return TRANSLATION_DICTIONARIES[this.currentLanguage];
  }

  get(key: TranslationKey): string {
    return this.currentDictionary[key];
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  findLanguageByCode(languageCode: string | undefined): Language {
    const lang = languageCode as Language;
    if (TRANSLATION_DICTIONARIES[lang]) {
      return lang;
    }

    return 'en';
  }
}
