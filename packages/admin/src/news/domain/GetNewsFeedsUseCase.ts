import { NewsFeedRepository } from "./Boundaries";
import { GetNewsFeedsError } from "./Errors";
import { Either, NewsFeedRawData } from "karate-stars-core";

export default class GetNewsFeedsUseCase {
    constructor(private newsFeedRepository: NewsFeedRepository) {}

    async execute(): Promise<Either<GetNewsFeedsError, NewsFeedRawData[]>> {
        const response = await this.newsFeedRepository.getAll();

        return response.map(feeds => feeds.map(feed => feed.toRawData()));
    }
}
