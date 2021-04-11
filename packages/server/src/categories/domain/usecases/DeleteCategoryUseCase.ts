import { Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CategoryRepository from "../boundaries/CategoryRepository";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export class DeleteCategoryUseCase extends AdminUseCase<
    DeleteResourceArgs,
    DeleteResourceError,
    ActionResult
> {
    constructor(private categoryRepository: CategoryRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.categoryRepository.getById(id);
        const deleteEntity = (id: Id) => this.categoryRepository.delete(id);

        return deleteResource(id, getById, deleteEntity);
    }
}
