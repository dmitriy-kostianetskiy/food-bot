import { assert, createStubInstance } from 'sinon';
import { CommunicationService } from './communication.service';
import { TelegramService } from './telegram.service';
import { TranslationService } from './translation.service';

function createService() {
  const telegramService = createStubInstance(TelegramService);
  const translationService = createStubInstance(TranslationService);

  const service = new CommunicationService(telegramService, translationService);

  return {
    service,
    telegramService,
    translationService,
  };
}

test('should not send message to telegram when no messages provided', async () => {
  // Arrange
  const { service, telegramService } = createService();

  // Act
  await service.sendMessageToChat('1');

  // Assert
  assert.notCalled(telegramService.sendHtml);
});

test('should send many messages to telegram when many messages provided', async () => {
  // Arrange
  const { service, telegramService } = createService();

  // Act
  await service.sendMessageToChat('1', 'Hello!', 'World!');

  // Assert
  assert.calledTwice(telegramService.sendHtml);
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
