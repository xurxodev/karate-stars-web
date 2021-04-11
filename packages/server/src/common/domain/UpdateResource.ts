import { Either, Id, ValidationError } from "karate-stars-core";
import { Entity, EntityData } from "karate-stars-core/build/entities/Entity";
import { ActionResult } from "../api/ActionResult";
import { ResourceNotFoundError, UnexpectedError, ValidationErrors } from "../api/Errors";
import { createIdOrResourceNotFound } from "./utils";

export type UpdateResourceError<EntityData> =
    | ValidationErrors<EntityData>
    | UnexpectedError
    | ResourceNotFoundError;

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
