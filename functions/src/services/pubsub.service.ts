import { PubSub } from '@google-cloud/pubsub';
import { Service } from 'typedi';

export type Topic = 'bot-messages' | 'generate-menu';

export interface BotMessage {
  readonly subscriberId: string;
  readonly messages: string[];
}

@Service()
export class PubsubService {
  constructor(private pubsub: PubSub) {}

  async publish(topic: 'generate-menu'): Promise<void>;
  async publish(topic: 'bot-messages', message: BotMessage): Promise<void>;
  async publish(topic: Topic, message?: object): Promise<void> {
    await this.pubsub.topic(topic).publishJSON(message || {});
  }
}
