import { CategoryRepository } from "./Boundaries";
import { CategoryData, Either } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetCategoriesUseCase {
    constructor(private CategoryRepository: CategoryRepository) {}

    async execute(): Promise<Either<DataError, CategoryData[]>> {
        const response = await this.CategoryRepository.getAll();

        return response.map(items => items.map(item => item.toData()));
    }
}
