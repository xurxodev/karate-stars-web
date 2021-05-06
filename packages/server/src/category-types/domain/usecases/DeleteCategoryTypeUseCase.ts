import { CategoryType, Either, Id } from "karate-stars-core";
import CategoryRepository from "../../../categories/domain/boundaries/CategoryRepository";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryTypeRepository from "../boundaries/CategoryTypeRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteCategoryTypeUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(
        private categoryTypeRepository: CategoryTypeRepository,
        private categoryRepository: CategoryRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.categoryTypeRepository.getById(id);
        const deleteEntity = (id: Id) => this.categoryTypeRepository.delete(id);

        const validateAsForeingKey = async (
            entity: CategoryType
        ): Promise<Either<ConflictError, CategoryType>> => {
            const usedAsForeingKey = (await this.categoryRepository.getAll()).some(category =>
                category.typeId.equals(entity.id)
            );

            return usedAsForeingKey
                ? Either.left({
                      kind: "ConflictError",
                      message: `Delete error category type ${entity.id.value} is used in some categories`,
                  } as ConflictError)
                : Either.right(entity);
        };

        return deleteResource(id, getById, deleteEntity, validateAsForeingKey);
    }
}
