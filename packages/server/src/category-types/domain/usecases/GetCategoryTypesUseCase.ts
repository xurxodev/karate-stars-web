import { CategoryTypeData, CategoryType } from "karate-stars-core";
import { GetResourcesUseCase } from "../../../common/domain/GetResourcesUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CategoryTypesRepository from "../boundaries/CategoryTypeRepository";

export class GetCategoriesUseCase extends GetResourcesUseCase<CategoryTypeData, CategoryType> {
    constructor(
        private CategoryTypeRepository: CategoryTypesRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected getEntities(): Promise<CategoryType[]> {
        return this.CategoryTypeRepository.getAll();
    }
}
