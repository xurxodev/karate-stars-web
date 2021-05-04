import { Category, Either, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResource, DeleteResourceError } from "../../../common/domain/DeleteResource";
import CompetitorRepository from "../../../competitors/domain/boundaries/CompetitorRepository";
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
    constructor(
        private categoryRepository: CategoryRepository,
        private competitorsRepository: CompetitorRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    protected run({ id }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        const getById = (id: Id) => this.categoryRepository.getById(id);
        const deleteEntity = (id: Id) => this.categoryRepository.delete(id);
        const validateAsForeingKey = async (
            entity: Category
        ): Promise<Either<ConflictError, Category>> => {
            const usedAsForeingKey = (await this.competitorsRepository.getAll()).some(
                competitor =>
                    competitor.categoryId.equals(entity.id) ||
                    competitor.achievements.some(achievement =>
                        achievement.categoryId.equals(entity.id)
                    )
            );

            return usedAsForeingKey
                ? Either.left({
                      kind: "ConflictError",
                      message: `Delete error category ${entity.id.value} is used in some competitors`,
                  } as ConflictError)
                : Either.right(entity);
        };
        return deleteResource(id, getById, deleteEntity, validateAsForeingKey);
    }
}
