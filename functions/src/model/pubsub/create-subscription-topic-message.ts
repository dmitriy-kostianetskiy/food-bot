import { Language } from '../translations';

export interface CreateSubscriptionTopicMessage {
  readonly id: string;
  readonly language: Language;
}
