import { NewsFeedRepository } from "./Boundaries";
import { Either, NewsFeed } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class SaveNewsFeedUseCase {
    constructor(private newsFeedRepository: NewsFeedRepository) {}

    async execute(newsFeed: NewsFeed): Promise<Either<DataError, true>> {
        return this.newsFeedRepository.save(newsFeed);
    }
}
