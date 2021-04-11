import { Either, CategoryTypeData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export class GetCategoryTypesUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    CategoryTypeData[]
> {
    constructor(
        private categoryTypeRepository: CategoryTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, CategoryTypeData[]>> {
        const CategoryTypes = await this.categoryTypeRepository.getAll();

        return Either.right(CategoryTypes.map(categoryType => categoryType.toData()));
    }
}
