import { PubSub } from '@google-cloud/pubsub';
import { Service } from 'typedi';
import { Topic, TopicMessage } from '../model/pubsub';

@Service()
export class PubsubService {
  constructor(private readonly pubsub: PubSub) {}

  async publish<T extends Topic>(topic: T, message: TopicMessage<T>): Promise<void> {
    await this.pubsub.topic(topic).publishMessage({ json: message });
  }
}
