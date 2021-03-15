import { Either, EitherAsync, Id, MaybeAsync, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    itemId: string;
    item: NewsFeedRawData;
}

type UpdateNewsFeedError =
    | ConflictError
    | ResourceNotFoundError
    | UnexpectedError
    | ValidationErrors<NewsFeed>;

export class UpdateNewsFeedUseCase extends AdminUseCase<
    CreateNewsFeedArg,
    UpdateNewsFeedError,
    ActionResult
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        itemId,
        item,
    }: CreateNewsFeedArg): Promise<Either<UpdateNewsFeedError, ActionResult>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${itemId} not found`,
        } as ResourceNotFoundError;

        return await EitherAsync.fromEither(Id.createExisted(itemId))
            .mapLeft<UpdateNewsFeedError>(() => notFoundError)
            .flatMap(async id =>
                MaybeAsync.fromPromise(this.newsFeedsRepository.getById(id)).toEither(notFoundError)
            )
            .flatMap(async existedFeed =>
                existedFeed.update(item).mapLeft(
                    error =>
                        ({
                            kind: "ValidationErrors",
                            errors: error,
                        } as ValidationErrors<NewsFeed>)
                )
            )
            .flatMap(entity => this.newsFeedsRepository.save(entity))
            .run();
    }
}
