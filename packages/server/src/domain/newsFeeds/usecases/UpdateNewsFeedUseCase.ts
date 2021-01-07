import { Either, EitherAsync, Id, MaybeAsync, NewsFeedRawData } from "karate-stars-core";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationError,
} from "../../../api/common/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../common/AdminUseCase";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface ActionResult {
    ok: boolean;
    count: number;
}

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    itemId: string;
    item: NewsFeedRawData;
}

type UpdateNewsFeedError =
    | ConflictError
    | ResourceNotFoundError
    | UnexpectedError
    | ValidationError;

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
                existedFeed.update(item, false).mapLeft(
                    error =>
                    ({
                        kind: "ValidationError",
                        errors: error,
                    } as ValidationError)
                )
            )
            .flatMap(async entity => {
                const saveResult = await this.newsFeedsRepository.save(entity);

                return saveResult.ok
                    ? Either.right(saveResult)
                    : Either.left<UpdateNewsFeedError, ActionResult>({
                        kind: "UnexpectedError",
                        error: new Error("An error has ocurred updating the news feed"),
                    });
            })
            .run();
    }
}
