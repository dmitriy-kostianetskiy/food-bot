import { CloudFunction, EventContext, pubsub } from 'firebase-functions';
import { Topic, TopicMessage } from '../model';

type Handler<T extends Topic> = (
  message: TopicMessage<T>,
  context: EventContext,
) => PromiseLike<unknown> | unknown;

export function topicFunction<T extends Topic>(
  topic: T,
  handler: Handler<T>,
): CloudFunction<pubsub.Message> {
  return pubsub.topic(topic).onPublish(async (message, context) => {
    const jsonMessage = message.json as TopicMessage<T>;

    await handler(jsonMessage, context);
  });
}
