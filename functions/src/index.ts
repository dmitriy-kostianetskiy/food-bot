import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { MEALS } from './data';
import { Subscription, Message } from './model';
import { printMeal, printIngredients } from './print'
import { DEFAULT_REGION } from './constants';
import { SubscriptionService, MenuService, MessagesService, pubSub, firestore } from './services';
import Telegraf from 'telegraf';
import { configureBot } from './bot';

const subscriptionService = new SubscriptionService(firestore);
const menuService = new MenuService(firestore);
const messageService = new MessagesService(pubSub);

const bot = new Telegraf(functions.config().bot.key);
configureBot(bot, subscriptionService);

const region = functions.region(DEFAULT_REGION);

export const generateMenu = region
  .pubsub
  .schedule('every sunday 17:00')
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
    console.log(jsonMessage);
    const { menu, subscription: subscriber } = jsonMessage;

    const ingredients = _(menu.meals)
      .flatMap(meal => meal.recipes)
      .flatMap(recipe => recipe.ingredients)
      .groupBy(item => item.name)
      .mapValues(value => {
        const amount = _(value)
          .map(item => item.amount)
          .filter()
          .reduce((acc, item) => acc + item, 0);
  
        const unit = _(value).map(item => item.unit).first();
  
        return { amount, unit };
      })
      .map((value, index) => ({
        unit: value.unit,
        amount: value.amount,
        name: index
      }))
      .orderBy(value => value.name)
      .value();

    const messages = [
      ...menu.meals.map(meal => printMeal(meal)),
      printIngredients(ingredients)
    ];

    for (const item of messages) {
      await bot.telegram.sendMessage(subscriber.id, item, { parse_mode: 'HTML' });
    }
  });


export const botHook = region
  .https
  .onRequest(async (request, response) => {
    await bot.handleUpdate(request.body, response);
  });
