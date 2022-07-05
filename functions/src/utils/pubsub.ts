import * as functions from 'firebase-functions';
import { CloudFunction, EventContext } from 'firebase-functions';
import { Topic, TopicMessage } from '../model';

type Handler<T extends Topic> = (
  message: TopicMessage<T>,
  context: EventContext,
) => PromiseLike<unknown> | unknown;

export function topicFunction<T extends Topic>(
  topic: T,
  handler: Handler<T>,
): CloudFunction<functions.pubsub.Message> {
  return functions
    .runWith({ secrets: ['TELEGRAM_BOT_TOKEN'] })
    .region('europe-west1')
    .pubsub.topic(topic)
    .onPublish(async (message, context) => {
      const jsonMessage = message.json as TopicMessage<T>;

      await handler(jsonMessage, context);
    });
}
