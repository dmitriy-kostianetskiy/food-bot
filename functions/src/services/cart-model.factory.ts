import * as _ from 'lodash';
import {
  MenuModel,
  CartModel,
  RecipeModel,
  IngredientModel,
  CartCategoryIngredient,
  CartCategoryIngredientItem,
  CartCategory,
} from '../model';
import { Service } from 'typedi';
import { IngredientMapper } from './ingredient-mapper';
import { IngredientMapperFactory } from './ingredient-mapper.factory';

@Service()
export class CartModelFactory {
  constructor(private readonly ingredientMapperFactory: IngredientMapperFactory) {}

  async create(menu: MenuModel): Promise<CartModel> {
    const mapper = await this.ingredientMapperFactory.create();

    return {
      categories: this.buildCartCategories(menu.dinners, mapper),
    };
  }

  private buildCartCategories(
    recipes: readonly RecipeModel[],
    mapper: IngredientMapper,
  ): readonly CartCategory[] {
    const ingredients = this.buildCartCategoryIngredients(recipes);

    return _(ingredients)
      .groupBy((item) => mapper.map(item.title))
      .map<CartCategory>((items, title) => ({
        items,
        title,
      }))
      .value();
  }

  private buildCartCategoryIngredients(
    recipes: readonly RecipeModel[],
  ): readonly CartCategoryIngredient[] {
    return _(recipes)
      .flatMap((recipe, index) => {
        const all = this.buildAllRecipeIngredients(recipe);

        return all.map((ingredient) => ({
          index,
          ingredient,
        }));
      })
      .groupBy(({ ingredient }) => ingredient.title)
      .map<CartCategoryIngredient>((groupItems, title) => {
        const mealIndexes = _(groupItems)
          .map((item) => item.index)
          .uniq()
          .value();

        const ingredients = groupItems.map((item) => item.ingredient);
        const items = this.buildCartCategoryIngredientItems(ingredients);

        return {
          title,
          mealIndexes,
          items,
        };
      })
      .value();
  }

  private buildCartCategoryIngredientItems(
    ingredients: readonly IngredientModel[],
  ): readonly CartCategoryIngredientItem[] {
    return _(ingredients)
      .groupBy((item) => item.unit || '')
      .mapValues((item) => item.reduce((acc, x) => acc + (x.amount || 0), 0))
      .map<CartCategoryIngredientItem>((amount, unit) => ({
        amount,
        unit,
      }))
      .filter(({ amount, unit }) => !!unit || !!amount)
      .value();
  }

  private buildAllRecipeIngredients(recipe: RecipeModel): readonly IngredientModel[] {
    return [...recipe.main.ingredients, ...(recipe.side ? recipe.side.ingredients : [])];
  }
}
