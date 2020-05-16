import { MenuModel, Subscription, Message } from '../model';
import { PubSub } from '@google-cloud/pubsub';

export class MessagesService {
  readonly MESSAGES_TOPIC_NAME = 'messages';

  constructor(private pubSubClient: PubSub) {}

  async publish(...messages: Message[]): Promise<void> {
    await Promise.all(messages.map(message => this.pubSubClient.topic(this.MESSAGES_TOPIC_NAME).publishJSON(message)));
  }
}
