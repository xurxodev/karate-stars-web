import { Either, NewsFeedRawData } from "karate-stars-core";
import { UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";

import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export class GetNewsFeedsUseCase extends AdminUseCase<
    AdminUseCaseArgs,
    UnexpectedError,
    NewsFeedRawData[]
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: AdminUseCaseArgs): Promise<Either<UnexpectedError, NewsFeedRawData[]>> {
        const newsFeed = await this.newsFeedsRepository.getAll();

        return Either.right(newsFeed.map(newsFeed => newsFeed.toRawData()));
    }
}
