import { CategoryRepository } from "./Boundaries";
import { Category, CategoryData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetCategoryByIdUseCase {
    constructor(private CategoryRepository: CategoryRepository) {}

    async execute(id: string): Promise<Either<DataError, CategoryData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<Category>(id => this.CategoryRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
