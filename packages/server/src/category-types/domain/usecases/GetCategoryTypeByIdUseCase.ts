import { Either, CategoryTypeData } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export interface GetCategoryTypeByIdArg {
    id: string;
}

type GetCategoryTypeByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCategoryTypeByIdUseCase {
    constructor(private categoryTypeRepository: CategoryTypeRepository) {}

    public async execute({
        id,
    }: GetCategoryTypeByIdArg): Promise<Either<GetCategoryTypeByIdError, CategoryTypeData>> {
        const result = await createIdOrResourceNotFound<GetCategoryTypeByIdError>(id)
            .flatMap(id => this.categoryTypeRepository.getById(id))
            .map(entity => entity.toData())
            .run();

        return result;
    }
}
