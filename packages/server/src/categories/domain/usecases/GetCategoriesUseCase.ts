import { Either, CategoryData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CategoryRepository from "../boundaries/CategoryRepository";

export class GetCategoriesUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    CategoryData[]
> {
    constructor(private categoryRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, CategoryData[]>> {
        const categories = await this.categoryRepository.getAll();

        return Either.right(categories.map(entity => entity.toData()));
    }
}
