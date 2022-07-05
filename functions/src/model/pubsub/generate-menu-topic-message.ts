import { Language } from '../translations';

export interface GenerateMenuTopicMessage {
  readonly chatId: string;
  readonly language: Language;
}
