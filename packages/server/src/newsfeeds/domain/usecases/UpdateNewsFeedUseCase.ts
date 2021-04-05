import { Either, NewsFeedData } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ConflictError,
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    itemId: string;
    item: NewsFeedData;
}

type UpdateNewsFeedError =
    | ConflictError
    | ResourceNotFoundError
    | UnexpectedError
    | ValidationErrors<NewsFeedData>;

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
        return await createIdOrResourceNotFound<UpdateNewsFeedError>(itemId)
            .flatMap(id => this.newsFeedsRepository.getById(id))
            .flatMap(async existedFeed =>
                existedFeed.update(item).mapLeft(error => ({
                    kind: "ValidationErrors",
                    errors: error,
                }))
            )
            .flatMap(entity => this.newsFeedsRepository.save(entity))
            .run();
    }
}
