import { Either, CategoryTypeData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export class GetCategoryTypesUseCase {
    constructor(private categoryTypeRepository: CategoryTypeRepository) {}

    public async execute(): Promise<Either<UnexpectedError, CategoryTypeData[]>> {
        const CategoryTypes = await this.categoryTypeRepository.getAll();

        return Either.right(CategoryTypes.map(categoryType => categoryType.toData()));
    }
}
