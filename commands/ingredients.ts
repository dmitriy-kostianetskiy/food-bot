import * as _ from 'lodash';
import { ContextMessageUpdate, Middleware } from 'telegraf';
import { generateIndexes, getIngredients } from '../common/generator';
import { printIngredients } from '../common/print';
import { Session } from '../model';

export const ingredientsCommand: Middleware<ContextMessageUpdate> = async (context) => {
  // tslint:disable-next-line: no-any
  const session = (<Session>(<any>context).session);

  if (!session.indexes) {
    session.indexes = generateIndexes();
  }

  const ingredients = getIngredients(session.indexes);

  const text = printIngredients(ingredients);
  await context.replyWithHTML(text);
};
