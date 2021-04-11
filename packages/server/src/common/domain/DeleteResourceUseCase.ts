import { Either, EitherAsync, Id } from "karate-stars-core";
import { Entity, EntityData } from "karate-stars-core/build/entities/Entity";
import UserRepository from "../../users/domain/boundaries/UserRepository";
import { ActionResult } from "../api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "./AdminUseCase";
import { createIdOrResourceNotFound } from "./utils";

export interface DeleteResourceArgs extends AdminUseCaseArgs {
    id: string;
}

export type DeleteResourceError = UnexpectedError | ResourceNotFoundError;

export abstract class DeleteResourceUseCase<
    TData extends EntityData,
    TEntity extends Entity<TData>
> extends AdminUseCase<DeleteResourceArgs, DeleteResourceError, ActionResult> {
    constructor(userRepository: UserRepository) {
        super(userRepository);
    }

    protected abstract getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>;
    protected abstract deleteEntity(id: Id): Promise<Either<UnexpectedError, ActionResult>>;

    public async run({
        id,
    }: DeleteResourceArgs): Promise<Either<DeleteResourceError, ActionResult>> {
        return createIdOrResourceNotFound<DeleteResourceError>(id)
            .flatMap(async id => this.getEntityById(id))
            .flatMap<ActionResult>(entity => this.deleteEntity(entity.id))
            .run();
    }
}

export function deleteResource<TData extends EntityData, TEntity extends Entity<TData>>(
    id: string,
    getEntityById: (id: Id) => Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>,
    deleteEntity: (id: Id) => Promise<Either<UnexpectedError, ActionResult>>
) {
    return createIdOrResourceNotFound<DeleteResourceError>(id)
        .flatMap(async id => getEntityById(id))
        .flatMap(entity => deleteEntity(entity.id))
        .run();
}

export function deleteResourceWithImage<TData extends EntityData, TEntity extends Entity<TData>>(
    id: string,
    getEntityById: (id: Id) => Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>,
    deleteImage: (entity: TEntity) => EitherAsync<UnexpectedError, true>,
    deleteEntity: (id: Id) => Promise<Either<UnexpectedError, ActionResult>>
) {
    return createIdOrResourceNotFound<DeleteResourceError>(id)
        .flatMap(async id => getEntityById(id))
        .flatMap<Id>(async entity =>
            deleteImage(entity)
                .map(() => entity.id)
                .run()
        )
        .flatMap(id => deleteEntity(id))
        .run();
}
