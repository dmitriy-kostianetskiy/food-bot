import { PubsubService } from './pubsub.service';
import { createStubInstance, assert } from 'sinon';
import { PubSub, Topic } from '@google-cloud/pubsub';

test('should publish message to pubsub', async () => {
  // Arrange
  const topic = createStubInstance(Topic);

  const pubSub = createStubInstance(PubSub, {
    topic,
  });
  const pubsubService = new PubsubService(pubSub);

  // Act
  await pubsubService.publish('generate-menu', { chatId: '1', language: 'en' });

  // Assert
  assert.calledOnceWithExactly(pubSub.topic, 'generate-menu');
});
