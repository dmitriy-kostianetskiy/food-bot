import { CategoryModel } from '../model/category-model';
import { Service } from 'typedi';
import { CategoryRepository } from '../repositories/category.repository';

@Service()
export class CategoryService {
  private cache?: readonly CategoryModel[];

  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getAll(): Promise<readonly CategoryModel[]> {
    if (!this.cache) {
      this.cache = await this.categoryRepository.fetchAll();
    }

    return this.cache;
  }
}
