import { Either, Id, ValidationError } from "karate-stars-core";
import { Entity, EntityData, EntityObjectData } from "karate-stars-core/build/entities/Entity";
import UserRepository from "../../users/domain/boundaries/UserRepository";
import { ActionResult } from "../api/ActionResult";
import { ResourceNotFoundError, UnexpectedError, ValidationErrors } from "../api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "./AdminUseCase";
import { createIdOrResourceNotFound } from "./utils";

export interface UpdateResourceArgs<EntityData> extends AdminUseCaseArgs {
    itemId: string;
    data: EntityData;
}

export type UpdateResourceError<EntityData> =
    | ValidationErrors<EntityData>
    | UnexpectedError
    | ResourceNotFoundError;

export abstract class UpdateResourceUseCase<
    Data extends EntityData,
    Entity extends EntityObjectData
> extends AdminUseCase<UpdateResourceArgs<Data>, UpdateResourceError<Data>, ActionResult> {
    constructor(userRepository: UserRepository) {
        super(userRepository);
    }

    protected abstract createEntity(data: Data): Either<ValidationError<Data>[], Entity>;
    protected abstract updateEntity(
        data: Data,
        entity: Entity
    ): Either<ValidationError<Data>[], Entity>;
    protected abstract getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, Entity>>;
    protected abstract saveEntity(entity: Entity): Promise<Either<UnexpectedError, ActionResult>>;

    public run({
        itemId,
        data,
    }: UpdateResourceArgs<Data>): Promise<Either<UpdateResourceError<Data>, ActionResult>> {
        return createIdOrResourceNotFound<UpdateResourceError<Data>>(itemId)
            .flatMap(async id => this.getEntityById(id))
            .flatMap(async entity =>
                this.updateEntity(data, entity).mapLeft(error => ({
                    kind: "ValidationErrors",
                    errors: error,
                }))
            )
            .flatMap(entity => this.saveEntity(entity))
            .run();
    }
}

export function updateResource<
    TData extends EntityData,
    TEntity extends Entity<TData>,
    TValidationData
>(
    id: string,
    data: TData,
    getEntityById: (id: Id) => Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>,
    updateEntity: (
        data: TData,
        entity: TEntity
    ) => Either<ValidationError<TValidationData>[], TEntity>,
    saveEntity: (entity: TEntity) => Promise<Either<UnexpectedError, ActionResult>>
) {
    return createIdOrResourceNotFound<UpdateResourceError<TValidationData>>(id)
        .flatMap(async id => getEntityById(id))
        .flatMap(async entity =>
            updateEntity(data, entity).mapLeft(error => ({
                kind: "ValidationErrors",
                errors: error,
            }))
        )
        .flatMap(entity => saveEntity(entity))
        .run();
}
