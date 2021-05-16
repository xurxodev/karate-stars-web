import { NewsFeedRepository } from "./Boundaries";
import { Either, NewsFeed, NewsFeedData } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";
import { createIdOrUnexpectedError } from "../../common/domain/utils";

export default class GetNewsFeedByIdUseCase {
    constructor(private newsFeedRepository: NewsFeedRepository) {}

    async execute(id: string): Promise<Either<DataError, NewsFeedData>> {
        return createIdOrUnexpectedError(id)
            .flatMap<NewsFeed>(id => this.newsFeedRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
