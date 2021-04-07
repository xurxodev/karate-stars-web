import { CategoryData, Category } from "karate-stars-core";
import { GetResourcesUseCase } from "../../../common/domain/GetResourcesUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CategorysRepository from "../boundaries/CategoryRepository";

export class GetCategoriesUseCase extends GetResourcesUseCase<CategoryData, Category> {
    constructor(private CategoryRepository: CategorysRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected getEntities(): Promise<Category[]> {
        return this.CategoryRepository.getAll();
    }
}
