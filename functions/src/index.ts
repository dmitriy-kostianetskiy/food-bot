import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { MEALS } from './data';
import { Subscription, Message } from './model';
import { printCart, printMenu } from './print'
import { DEFAULT_REGION } from './constants';
import { SubscriptionService, MenuService, MessagesService, pubSub, firestore } from './services';
import Telegraf from 'telegraf';
import { configureBot } from './bot';
import { buildCart } from './cart';

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
    const meals = _(_.range(MEALS.length))
      .shuffle()
      .take(7)
      .map(index => MEALS[index])
      .value();

    await menuService.replaceCurrentMenu({
      meals
    });
  });

export const publishToAll = region
  .firestore
  .document(menuService.CURRENT_MENU_PATH)
  .onWrite(async () => {
    const subscribers = await subscriptionService.fetchSubscriptions();
    const menu = await menuService.fetchCurrentMenu();

    await messageService.publish(...subscribers.map(subscription => ({
      menu,
      subscription
    })));
  });

export const publishToSubscriber = region
  .firestore
  .document(`${subscriptionService.SUBSCRIPTIONS_PATH}/{subscribersId}`)
  .onCreate(async (snapshot) => {
    const menu = await menuService.fetchCurrentMenu();
    const subscription = snapshot.data() as Subscription;

    await messageService.publish({
      menu,
      subscription
    });
  });

export const sendMessage = region
  .pubsub
  .topic(messageService.MESSAGES_TOPIC_NAME)
  .onPublish(async (message) => {
    const jsonMessage = message.json as Message;
    const { menu, subscription } = jsonMessage;

    const cart = buildCart(menu.meals);

    const messages = [
      ...printMenu(menu),
      printCart(cart)
    ];

    for (const item of messages) {
      await bot.telegram.sendMessage(subscription.id, item, { parse_mode: 'HTML' });
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
