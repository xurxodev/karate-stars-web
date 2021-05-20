import { CategoryTypeRepository } from "./Boundaries";
import { CategoryTypeData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetCategoryTypesUseCase {
    constructor(private CategoryTypeRepository: CategoryTypeRepository) {}

    async execute(): Promise<Either<DataError, CategoryTypeData[]>> {
        const response = await this.CategoryTypeRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
