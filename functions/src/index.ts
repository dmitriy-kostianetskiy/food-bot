import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { Subscription, Message, SendMenuMessage, GenerateMenuMessage } from './model';
import { DEFAULT_REGION } from './constants';
import { SubscriptionService, MenuService, MessagesService, pubSub, firestore } from './services';
import Telegraf from 'telegraf';
import { configureBot } from './bot';
import { Menu } from './menu';

const subscriptionService = new SubscriptionService(firestore);
const menuService = new MenuService(firestore);
const messageService = new MessagesService(pubSub);

const bot = new Telegraf(functions.config().bot.key);
configureBot(bot, subscriptionService);

const region = functions.region(DEFAULT_REGION);

export const generateMenu = region
  .pubsub
  .schedule('every friday 12:00')
  .timeZone('Europe/Moscow')
  .onRun(async () => {
    await messageService.publish(<GenerateMenuMessage>{
      type: 'generateMenu'
    });
  });

export const publishToAll = region
  .firestore
  .document(menuService.CURRENT_MENU_PATH)
  .onWrite(async () => {
    const subscribers = await subscriptionService.fetchSubscriptions();
    const menu = await menuService.fetchCurrentMenu();

    await messageService.publish(...subscribers.map(subscription => {
      return <SendMenuMessage>{
        type: 'sendMenu',
        menu,
        subscription
      }
    }));
  });

export const publishToSubscriber = region
  .firestore
  .document(`${subscriptionService.SUBSCRIPTIONS_PATH}/{subscribersId}`)
  .onCreate(async (snapshot) => {
    const subscription = snapshot.data() as Subscription;
    
    if (!subscription?.id) {
      return;
    }

    const menu = await menuService.fetchCurrentMenu();

    await messageService.publish(<SendMenuMessage>{
      type: 'sendMenu',
      menu,
      subscription
    });
  });

export const sendMessage = region
  .pubsub
  .topic(messageService.MESSAGES_TOPIC_NAME)
  .onPublish(async (message) => {
    const jsonMessage = message.json as Message;

    if (!jsonMessage.type) {
      return;
    }

    switch (jsonMessage.type) {
      case 'sendMenu':
        await sendMenuHandler(jsonMessage);
        return;
      case 'generateMenu':
        await generateMenuHandler();
        return;
    }
  });

export const botHook = region
  .https
  .onRequest(async (request, response) => {
    try {
      console.log('Incoming request', JSON.stringify(request.body));

      await bot.handleUpdate(request.body, response);
    } finally {
      response.status(200).send();
    }
  });


async function sendMenuHandler(message: SendMenuMessage): Promise<void> {
  if (!message.menu || !message.subscription?.id) {
    return;
  }

  const menu = new Menu(message.menu);
  const cart = menu.createCart();

  const messages = [
    ...menu.print(),
    cart.print()
  ];

  for (const item of messages) {
    await bot.telegram.sendMessage(message.subscription.id, item, { parse_mode: 'HTML' });
  }
}

async function generateMenuHandler(): Promise<void> {
  const { menu } = Menu.createRandom();

  await menuService.replaceCurrentMenu(menu);
}
