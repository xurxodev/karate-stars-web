import { CategoryRepository } from "./Boundaries";
import { Either, Category } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveCategoryUseCase {
    constructor(private CategoryRepository: CategoryRepository) {}

    async execute(entity: Category): Promise<Either<DataError, true>> {
        return this.CategoryRepository.save(entity);
    }
}
