import { Either, CategoryTypeData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export interface GetCategoryTypeByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetCategoryTypeByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCategoryTypeByIdUseCase extends AdminUseCase<
    GetCategoryTypeByIdArg,
    GetCategoryTypeByIdError,
    CategoryTypeData
> {
    constructor(
        private categoryTypeRepository: CategoryTypeRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetCategoryTypeByIdArg): Promise<Either<GetCategoryTypeByIdError, CategoryTypeData>> {
        const result = await createIdOrResourceNotFound<GetCategoryTypeByIdError>(id)
            .flatMap(id => this.categoryTypeRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
