import { Either, CategoryData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import CategoryRepository from "../boundaries/CategoryRepository";

export interface GetCategoryByIdArg {
    id: string;
}

type GetCategoryByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCategoryByIdUseCase {
    constructor(private categoryRepository: CategoryRepository) {}

    public async execute({
        id,
    }: GetCategoryByIdArg): Promise<Either<GetCategoryByIdError, CategoryData>> {
        const result = await createIdOrResourceNotFound<GetCategoryByIdError>(id)
            .flatMap(id => this.categoryRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
