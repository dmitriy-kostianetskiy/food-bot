import { CloudFunction, HttpsFunction } from 'firebase-functions';

export abstract class FunctionCreator {
  abstract createFunction(): CloudFunction<unknown> | HttpsFunction;
}
