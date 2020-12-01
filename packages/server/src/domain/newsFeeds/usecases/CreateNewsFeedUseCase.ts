import { Either, EitherAsync, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import { ConflictError, UnexpectedError, ValidationError } from "../../../api/common/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../common/AdminUseCase";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface ActionResult {
    ok: boolean;
    count: number;
}

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    item: NewsFeedRawData;
}

type CreateNewsFeedError = ValidationError | UnexpectedError | ConflictError;

export class CreateNewsFeedUseCase extends AdminUseCase<
    CreateNewsFeedArg,
    CreateNewsFeedError,
    ActionResult
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        item,
    }: CreateNewsFeedArg): Promise<Either<CreateNewsFeedError, ActionResult>> {
        return EitherAsync.fromEither(NewsFeed.create(item))
            .mapLeft(
                error =>
                    ({
                        kind: "ValidationError",
                        errors: error,
                    } as CreateNewsFeedError)
            )
            .flatMap(async entity => {
                const existedItem = await this.newsFeedsRepository.getById(entity.id);

                return existedItem.fold(
                    () => Either.right<CreateNewsFeedError, NewsFeed>(entity),
                    () =>
                        Either.left<CreateNewsFeedError, NewsFeed>({
                            kind: "ConflictError",
                            message: "Already exist a news feed item with id " + entity.id.value,
                        } as ConflictError)
                );
            })
            .flatMap(async entity => {
                const saveResult = await this.newsFeedsRepository.save(entity);

                return saveResult.count > 0
                    ? Either.right(saveResult)
                    : Either.left<CreateNewsFeedError, ActionResult>({
                          kind: "UnexpectedError",
                          error: new Error("An error has ocurred creating the news feed"),
                      } as UnexpectedError);
            })
            .run();
    }
}
