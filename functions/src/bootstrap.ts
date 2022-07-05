import * as admin from 'firebase-admin';

import { CloudFunction, HttpsFunction } from 'firebase-functions';

import { Container, Constructable } from 'typedi';

import { FunctionCreator } from './functions/function-creator';
import { PubSub } from '@google-cloud/pubsub';
import { StartCommand } from './commands/start.command';
import { StopCommand } from './commands/stop.command';

export type CreateFunction = (
  type: Constructable<FunctionCreator>,
) => CloudFunction<unknown> | HttpsFunction;

export default function bootstrap(): CreateFunction {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  Container.set(admin.firestore.Firestore, admin.firestore());
  Container.set(PubSub, new PubSub());

  Container.import([StartCommand, StopCommand]);

  return (type) => Container.get<FunctionCreator>(type).createFunction();
}
