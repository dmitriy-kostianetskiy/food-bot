import { assert, createStubInstance } from 'sinon';
import { CommunicationService } from './communication.service';
import { PubsubService } from './pubsub.service';
import { TelegramService } from './telegram.service';
import { TranslationService } from './translation.service';

function createService() {
  const pubSubService = createStubInstance(PubsubService);
  const telegramService = createStubInstance(TelegramService);
  const translationService = createStubInstance(TranslationService);

  const service = new CommunicationService(pubSubService, telegramService, translationService);

  return {
    service,
    pubSubService,
    telegramService,
    translationService,
  };
}

test('should not send pubSub message or send message to telegram when no messages provided', async () => {
  // Arrange
  const { service, telegramService, pubSubService } = createService();

  // Act
  await service.sendMessageToChat('1');

  // Assert
  assert.notCalled(telegramService.sendHtml);
  assert.notCalled(pubSubService.publish);
});

test('should send message to telegram when one message provided', async () => {
  // Arrange
  const { service, telegramService } = createService();

  // Act
  await service.sendMessageToChat('1', 'Hello World!');

  // Assert
  assert.calledWithExactly(telegramService.sendHtml, '1', 'Hello World!');
});

test('should send pubSub message many messages provided', async () => {
  // Arrange
  const { service, pubSubService } = createService();

  // Act
  await service.sendMessageToChat('1', 'Hello!', 'World!');

  // Assert
  assert.calledOnceWithExactly(pubSubService.publish, 'telegram-bot-messages', {
    chatId: '1',
    messages: ['Hello!', 'World!'],
  });
});

test('should send thank you message', async () => {
  // Arrange
  const { service, telegramService, translationService } = createService();
  translationService.get.withArgs('thankYou').returns('Thank you!');

  // Act
  await service.sendThankYouMessage('1');

  // Assert
  assert.calledWithExactly(telegramService.sendHtml, '1', 'Thank you!');
});

test('should send good bye message', async () => {
  // Arrange
  const { service, telegramService, translationService } = createService();
  translationService.get.withArgs('goodBye').returns('Good bye!');

  // Act
  await service.sendGoodByeMessage('1');

  // Assert
  assert.calledWithExactly(telegramService.sendHtml, '1', 'Good bye!');
});

test('should send error message', async () => {
  // Arrange
  const { service, telegramService, translationService } = createService();
  translationService.get.withArgs('error').returns('Error!');

  // Act
  await service.sendErrorMessage('1');

  // Assert
  assert.calledWithExactly(telegramService.sendHtml, '1', 'Error!');
});
