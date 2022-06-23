import { TelegramBotMessagingTopicMessage } from './telegram-bot-messaging-topic-message';
import { CreateSubscriptionTopicMessage } from './create-subscription-topic-message';
import { RemoveSubscriptionTopicMessage } from './remove-subscription-topic-message';
import { GenerateMenuTopicMessage } from './generate-menu-topic-message';

export type Topic =
  | 'telegram-bot-messages'
  | 'create-subscription'
  | 'remove-subscription'
  | 'generate-menu';

export type TopicMessage<T extends Topic> = T extends 'telegram-bot-messages'
  ? TelegramBotMessagingTopicMessage
  : T extends 'create-subscription'
  ? CreateSubscriptionTopicMessage
  : T extends 'remove-subscription'
  ? RemoveSubscriptionTopicMessage
  : T extends 'generate-menu'
  ? GenerateMenuTopicMessage
  : never;
