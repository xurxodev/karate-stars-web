import { CategoryTypeRepository } from "./Boundaries";
import { CategoryType, CategoryTypeData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetCategoryTypeByIdUseCase {
    constructor(private CategoryTypeRepository: CategoryTypeRepository) {}

    async execute(id: string): Promise<Either<DataError, CategoryTypeData>> {
        return await createIdOrUnexpectedError(id)
            .flatMap<CategoryType>(id => this.CategoryTypeRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
