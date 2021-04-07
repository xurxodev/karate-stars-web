import { Either } from "karate-stars-core";
import { EntityData, Entity } from "karate-stars-core/build/entities/Entity";
import UserRepository from "../../users/domain/boundaries/UserRepository";
import { ResourceNotFoundError, UnexpectedError } from "../api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "./AdminUseCase";

export interface GetResourceArgs extends AdminUseCaseArgs {}

type GetResourceError = UnexpectedError | ResourceNotFoundError;

export abstract class GetResourcesUseCase<
    TData extends EntityData,
    TEntity extends Entity<TData>
> extends AdminUseCase<GetResourceArgs, GetResourceError, TData[]> {
    constructor(userRepository: UserRepository) {
        super(userRepository);
    }

    protected abstract getEntities(): Promise<TEntity[]>;

    public async run(_: GetResourceArgs): Promise<Either<GetResourceError, TData[]>> {
        const entities = await this.getEntities();

        return Either.right(entities.map(entity => entity.toData()));
    }
}
