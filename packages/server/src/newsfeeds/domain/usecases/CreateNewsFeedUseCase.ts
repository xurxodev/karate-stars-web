import { Either, EitherAsync, NewsFeed, NewsFeedRawData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ConflictError, UnexpectedError, ValidationErrors } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    item: NewsFeedRawData;
}

type CreateNewsFeedError = ValidationErrors<NewsFeed> | UnexpectedError | ConflictError;

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
                        kind: "ValidationErrors",
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
            .flatMap(entity => this.newsFeedsRepository.save(entity))
            .run();
    }
}
