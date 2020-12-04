import { NewsFeedRepository } from "./Boundaries";
import { Either, NewsFeedRawData } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetNewsFeedsUseCase {
    constructor(private newsFeedRepository: NewsFeedRepository) {}

    async execute(search?: string): Promise<Either<DataError, NewsFeedRawData[]>> {
        const response = await this.newsFeedRepository.getAll(search);

        return response.map(feeds => feeds.map(feed => feed.toRawData()));
    }
}
