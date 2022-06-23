import { PubSub } from '@google-cloud/pubsub';
import { Service } from 'typedi';
import {
  BotMessagingTopicMessage as TelegramBotMessagingTopicMessage,
  SubscriptionTopicMessage,
} from '../model/pubsub';

export type Topic = 'telegram-bot-messages' | 'subscriptions';

@Service()
export class PubsubService {
  constructor(private readonly pubsub: PubSub) {}

  async publish(topic: 'subscriptions', message: SubscriptionTopicMessage): Promise<void>;
  async publish(
    topic: 'telegram-bot-messages',
    message: TelegramBotMessagingTopicMessage,
  ): Promise<void>;
  async publish(topic: Topic, message?: object): Promise<void> {
    // TODO: replace publishJSON
    await this.pubsub.topic(topic).publishJSON(message || {});
  }
}
