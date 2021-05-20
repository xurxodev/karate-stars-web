import { CategoryTypeRepository } from "./Boundaries";
import { Either, CategoryType } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveCategoryTypeUseCase {
    constructor(private CategoryTypeRepository: CategoryTypeRepository) {}

    async execute(entity: CategoryType): Promise<Either<DataError, true>> {
        return this.CategoryTypeRepository.save(entity);
    }
}
