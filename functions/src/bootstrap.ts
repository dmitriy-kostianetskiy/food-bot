import * as admin from 'firebase-admin';

import { CloudFunction, HttpsFunction, config } from 'firebase-functions';

import { Container, Constructable } from 'typedi';

import { FunctionCreator } from './functions/function-creator';
import { PubSub } from '@google-cloud/pubsub';
import { CONFIG_TOKEN } from './tokens';

export type CreateFunction = (
  type: Constructable<FunctionCreator>,
) => CloudFunction<unknown> | HttpsFunction;

export default function bootstrap(): CreateFunction {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  Container.set(admin.firestore.Firestore, admin.firestore());
  Container.set(PubSub, new PubSub());
  Container.set(CONFIG_TOKEN, config());

  return (type) => Container.get<FunctionCreator>(type).createFunction();
}
