import { RecipeModel } from './recipe-model';

export interface MenuModel {
  readonly dinners: readonly RecipeModel[];
}
