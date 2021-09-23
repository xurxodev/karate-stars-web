import { Either, CategoryData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";

import CategoryRepository from "../boundaries/CategoryRepository";

export class GetCategoriesUseCase {
    constructor(private categoryRepository: CategoryRepository) {}

    public async execute(): Promise<Either<UnexpectedError, CategoryData[]>> {
        const categories = await this.categoryRepository.getAll();

        return Either.right(categories.map(entity => entity.toData()));
    }
}
