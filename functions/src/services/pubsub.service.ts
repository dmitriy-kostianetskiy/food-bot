import { PubSub } from '@google-cloud/pubsub';
import { Service } from 'typedi';
import { SubscriptionTopicMessage } from '../model/pubsub';

export type Topic = 'bot-messages' | 'generate-menu' | 'subscriptions';

export interface BotMessage {
  readonly subscriberId: string;
  readonly messages: readonly string[];
}

@Service()
export class PubsubService {
  constructor(private readonly pubsub: PubSub) {}

  async publish(topic: 'generate-menu'): Promise<void>;
  async publish(topic: 'subscriptions', message: SubscriptionTopicMessage): Promise<void>;
  async publish(topic: 'bot-messages', message: BotMessage): Promise<void>;
  async publish(topic: Topic, message?: object): Promise<void> {
    // TODO: replace publishJSON
    await this.pubsub.topic(topic).publishJSON(message || {});
  }
}
