import { Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResourceUseCase";
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
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.categoryTypeRepository.getById(id);
        const deleteEntity = (id: Id) => this.categoryTypeRepository.delete(id);

        return deleteResource(id, getById, deleteEntity);
    }
}
