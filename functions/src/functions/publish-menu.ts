// import * as functions from 'firebase-functions';

// import { DEFAULT_REGION, MENU_PATH, SUBSCRIPTIONS_PATH } from '../constants';

// import { CategoryService } from '../data-services/category.service';
// import { Container } from 'typedi';
// import { Menu } from '../menu';
// import { MenuService } from '../data-services/menu.service';
// import { MessagesService } from '../messaging-services/messages.service';
// import { Subscription } from '../model';
// import { SubscriptionService } from '../data-services/subscription.service';

// const subscriptionService = Container.get(SubscriptionService);
// const menuService = Container.get(MenuService);
// const messagesService = Container.get(MessagesService);
// const categoryService = Container.get(CategoryService);

// export const publishToAll = functions
//   .region(DEFAULT_REGION)
//   .firestore
//   .document(MENU_PATH)
//   .onWrite(async () => {
//     const [
//       subscriptions,
//       menuModel,
//       categories
//     ] = await Promise.all([
//       subscriptionService.fetchAll(),
//       menuService.fetchCurrentMenu(),
//       categoryService.fetchAll()
//     ]);

//     const menu = new Menu(menuModel, categories);
//     const messages = menu.printWithCart();

//     await messagesService.publish('bot-messages',
//       ...subscriptions.map(subscription => ({
//           messages,
//           subscriberId: subscription.id
//         }
//     )));
//   });

// export const publishToPeer = functions
//   .region(DEFAULT_REGION)
//   .firestore
//   .document(`${SUBSCRIPTIONS_PATH}/{subscribersId}`)
//   .onCreate(async (snapshot) => {
//     const subscription = snapshot.data() as Subscription;

//     if (!subscription?.id) {
//       return;
//     }

//     const [
//       menuModel,
//       categories
//     ] = await Promise.all([
//       menuService.fetchCurrentMenu(),
//       categoryService.fetchAll()
//     ]);

//     const menu = new Menu(menuModel, categories);

//     await messagesService.publish('bot-messages', {
//       subscriberId: subscription.id,
//       messages: menu.printWithCart()
//     });
//   });
