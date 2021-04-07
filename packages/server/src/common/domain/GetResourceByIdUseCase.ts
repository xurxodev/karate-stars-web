import { Either, Id } from "karate-stars-core";
import { EntityData, Entity } from "karate-stars-core/build/entities/Entity";
import UserRepository from "../../users/domain/boundaries/UserRepository";
import { ResourceNotFoundError, UnexpectedError } from "../api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "./AdminUseCase";
import { createIdOrResourceNotFound } from "./utils";

export interface GetResourceArgs extends AdminUseCaseArgs {
    id: string;
}

type GetResourceError = UnexpectedError | ResourceNotFoundError;

export abstract class GetResourceByIdUseCase<
    TData extends EntityData,
    TEntity extends Entity<TData>
> extends AdminUseCase<GetResourceArgs, GetResourceError, TData> {
    constructor(userRepository: UserRepository) {
        super(userRepository);
    }

    protected abstract getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>;

    public async run({ id }: GetResourceArgs): Promise<Either<GetResourceError, TData>> {
        return createIdOrResourceNotFound<GetResourceError>(id)
            .flatMap(async id => this.getEntityById(id))
            .map(entity => entity.toData())
            .run();
    }
}
