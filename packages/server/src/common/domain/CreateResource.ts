import { Either, EitherAsync, Id, ValidationError } from "karate-stars-core";
import { EntityData, Entity } from "karate-stars-core/build/entities/Entity";
import { ActionResult } from "../api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../api/Errors";

export type CreateResourceError<EntityData> =
    | ValidationErrors<EntityData>
    | UnexpectedError
    | ConflictError;

export function createResource<
    TData extends EntityData,
    TEntity extends Entity<TData>,
    TValidationData
>(
    data: TData,
    createEntity: (data: TData) => Either<ValidationError<TValidationData>[], TEntity>,
    getEntityById: (id: Id) => Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>,
    saveEntity: (entity: TEntity) => Promise<Either<UnexpectedError, ActionResult>>
) {
    return EitherAsync.fromEither(createEntity(data))
        .mapLeft(
            error =>
                ({
                    kind: "ValidationErrors",
                    errors: error,
                } as CreateResourceError<TValidationData>)
        )
        .flatMap(async entity => {
            const existedItem = await getEntityById(entity.id);

            return existedItem.fold(
                () => Either.right<CreateResourceError<TValidationData>, TEntity>(entity),
                () =>
                    Either.left<CreateResourceError<TValidationData>, TEntity>({
                        kind: "ConflictError",
                        message: "Already exist an item with id " + entity.id.value,
                    } as ConflictError)
            );
        })
        .flatMap(entity => saveEntity(entity))
        .run();
}
