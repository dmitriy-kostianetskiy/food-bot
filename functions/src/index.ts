import * as functions from 'firebase-functions';
import * as _ from 'lodash';
import { MEALS } from './data';
import { Menu, Subscriber, Message } from './model';
import { db } from './db';
import { printMeal, printIngredients } from './print'
import { createBot } from './bot';
import { pubSub } from './pubsub';

const REGION = 'europe-west3';
const bot = createBot(functions.config().bot.key);

export const generateMenu = functions
  .region(REGION)
  .pubsub
  .schedule('every 5 minutes')
  .onRun(async () => {
    const meals = _(_.range(MEALS.length))
      .shuffle()
      .take(7)
      .map(index => MEALS[index])
      .value();

    const menu: Menu = {
      meals
    };

    await db.doc('menu/currentMenu').set(menu);
  });

export const publishToAll = functions
  .region(REGION)
  .firestore
  .document('menu/currentMenu')
  .onWrite(async () => {
    const subscribers = (await db.collection('subscribers').get()).docs.map(document => document.data() as Subscriber);
    const menu = (await db.doc('menu/currentMenu').get()).data() as Menu;

    await Promise.all(subscribers.map(subscriber => {
      const message = {
        menu,
        subscriber
      };

      console.log(message);

      return pubSub.topic('messages').publishJSON(message);
    }));
  });

export const publishToSubscriber = functions
  .region(REGION)
  .firestore
  .document('subscribers/{subscribersId}')
  .onCreate(async (snapshot) => {
    const subscriber = snapshot.data() as Subscriber;
    const menu = (await db.doc('/menu/currentMenu').get()).data() as Menu;
    const message = {
      menu,
      subscriber
    };

    return pubSub.topic('messages').publishJSON(message);
  });

export const sendMessage = functions
  .region(REGION)
  .pubsub
  .topic('messages')
  .onPublish(async (message) => {
    const jsonMessage = message.json as Message;
    console.log(jsonMessage);
    const { menu, subscriber } = jsonMessage;

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


export const botHook = functions
  .region(REGION)
  .https
  .onRequest(async (request, response) => {
    await bot.handleUpdate(request.body, response);
  });
