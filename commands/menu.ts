import * as _ from 'lodash';
import { ContextMessageUpdate, Middleware } from 'telegraf';
import { generateIndexes, getMeals } from '../common/generator';
import { printMeal } from '../common/print';
import { Session } from '../model';

export const menuCommand = (generateNew: boolean): Middleware<ContextMessageUpdate> => {
  return async (context) => {
    // tslint:disable-next-line: no-any
    const session = (<Session>(<any>context).session);

    if (!session.indexes || generateNew) {
      session.indexes = generateIndexes();
    }

    const meals = getMeals(session.indexes);

    for (const meal of meals) {
      const text = printMeal(meal);

      await context.replyWithHTML(text);
    }
  };
};
