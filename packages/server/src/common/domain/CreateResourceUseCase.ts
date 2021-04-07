import { Either, EitherAsync, Id, ValidationError } from "karate-stars-core";
import { EntityData, Entity } from "karate-stars-core/build/entities/Entity";
import UserRepository from "../../users/domain/boundaries/UserRepository";
import { ActionResult } from "../api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "./AdminUseCase";

export interface CreateResourceArgs<EntityData> extends AdminUseCaseArgs {
    data: EntityData;
}

type CreateResourceError<EntityData> =
    | ValidationErrors<EntityData>
    | UnexpectedError
    | ConflictError;

export abstract class CreateResourceUseCase<
    TData extends EntityData,
    TEntity extends Entity<TData>
> extends AdminUseCase<CreateResourceArgs<TData>, CreateResourceError<TData>, ActionResult> {
    constructor(userRepository: UserRepository) {
        super(userRepository);
    }

    protected abstract createEntity(data: TData): Either<ValidationError<TData>[], TEntity>;
    protected abstract getEntityById(
        id: Id
    ): Promise<Either<ResourceNotFoundError | UnexpectedError, TEntity>>;
    protected abstract saveEntity(entity: TEntity): Promise<Either<UnexpectedError, ActionResult>>;

    public async run({
        data,
    }: CreateResourceArgs<TData>): Promise<Either<CreateResourceError<TData>, ActionResult>> {
        return EitherAsync.fromEither(this.createEntity(data))
            .mapLeft(
                error =>
                    ({
                        kind: "ValidationErrors",
                        errors: error,
                    } as CreateResourceError<TData>)
            )
            .flatMap(async entity => {
                const existedItem = await this.getEntityById(entity.id);

                return existedItem.fold(
                    () => Either.right<CreateResourceError<TData>, TEntity>(entity),
                    () =>
                        Either.left<CreateResourceError<TData>, TEntity>({
                            kind: "ConflictError",
                            message: "Already exist an item with id " + entity.id.value,
                        } as ConflictError)
                );
            })
            .flatMap(entity => this.saveEntity(entity))
            .run();
    }
}
