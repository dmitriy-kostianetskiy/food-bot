import { PubsubService } from './pubsub.service';
import { createStubInstance, assert } from 'sinon';
import { PubSub, Topic } from '@google-cloud/pubsub';

test('should publish message to pubsub', () => {
  // Arrange
  const topic = createStubInstance(Topic);

  const pubSub = createStubInstance(PubSub, {
    topic,
  });
  const pubsubService = new PubsubService(pubSub);

  // Act
  pubsubService.publish('generate-menu', { subscriptionIds: ['1', '2', '3'] });

  // Assert
  assert.calledOnceWithExactly(pubSub.topic, 'generate-menu');
});
