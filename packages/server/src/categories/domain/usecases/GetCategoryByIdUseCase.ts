import { Either, CategoryData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryRepository from "../boundaries/CategoryRepository";

export interface GetCategoryByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetCategoryByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCategoryByIdUseCase extends AdminUseCase<
    GetCategoryByIdArg,
    GetCategoryByIdError,
    CategoryData
> {
    constructor(private categoryRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetCategoryByIdArg): Promise<Either<GetCategoryByIdError, CategoryData>> {
        const result = await createIdOrResourceNotFound<GetCategoryByIdError>(id)
            .flatMap(id => this.categoryRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
