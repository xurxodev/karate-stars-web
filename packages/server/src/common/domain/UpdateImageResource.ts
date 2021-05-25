import { Either, EitherAsync, Id, ValidationError } from "karate-stars-core";
import { Entity, EntityData } from "karate-stars-core/build/entities/Entity";
import { ActionResult } from "../api/ActionResult";
import { ResourceNotFoundError, UnexpectedError, ValidationErrors } from "../api/Errors";
import { createIdOrResourceNotFound } from "./utils";

export type UpdateImageResourceError<EntityData> =
    | ValidationErrors<EntityData>
    | UnexpectedError
    | ResourceNotFoundError;

export async function updateImageResource<
    TData extends EntityData,
    TEntity extends Entity<TData>,
    TValidationData
>(
    id: string,
    getEntityById: (id: Id) => Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>,
    deletePreviousImage: (entity: TEntity) => EitherAsync<UnexpectedError, true>,
    uploadNewImage: () => Promise<Either<UnexpectedError, string>>,
    updateEntity: (
        entity: TEntity,
        imageUrl: string
    ) => Either<ValidationError<TValidationData>[], TEntity>,
    saveEntity: (entity: TEntity) => Promise<Either<UnexpectedError, ActionResult>>
) {
    return await createIdOrResourceNotFound<UpdateImageResourceError<TValidationData>>(id)
        .flatMap(async id => getEntityById(id))
        .flatMap(async entity => {
            return deletePreviousImage(entity)
                .flatMap(() => uploadNewImage())
                .mapLeft(error => error as UpdateImageResourceError<TValidationData>)
                .flatMap(async newImageUrl =>
                    updateEntity(entity, newImageUrl).mapLeft(
                        error =>
                            ({
                                kind: "ValidationErrors",
                                errors: error,
                            } as UpdateImageResourceError<TValidationData>)
                    )
                )
                .run();
        })
        .flatMap(entity => saveEntity(entity))
        .run();
}
