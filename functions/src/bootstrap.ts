import * as admin from 'firebase-admin'

import { CloudFunction, HttpsFunction } from 'firebase-functions'
import Container, { ObjectType } from 'typedi'

import { FunctionCreator } from './functions/function-creator'
import { PubSub } from '@google-cloud/pubsub'

export type CreateFunction = (type: ObjectType<FunctionCreator>) => CloudFunction<unknown> | HttpsFunction;

export default function bootstrap(): CreateFunction {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  })

  Container.set(admin.firestore.Firestore, admin.firestore())
  Container.set(PubSub, new PubSub())

  return (type) => Container.get<FunctionCreator>(type).createFunction()
}
