import { Either, NewsFeedRawData } from "karate-stars-core";
import { AdminUseCase, AdminUseCaseError, WithUserIdArgs } from "../../common/AdminUseCase";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export class GetNewsFeedsUseCase extends AdminUseCase<WithUserIdArgs, NewsFeedRawData[]> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run(_: WithUserIdArgs): Promise<Either<AdminUseCaseError, NewsFeedRawData[]>> {
        const newsFeed = await this.newsFeedsRepository.getAll();

        return Either.right(newsFeed.map(newsFeed => newsFeed.toRawData()));
    }
}
