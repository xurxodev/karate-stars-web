import { NewsFeedRepository } from "./Boundaries";
import { Either, EitherAsync, Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class GetNewsFeedByIdUseCase {
    constructor(private newsFeedRepository: NewsFeedRepository) {}

    async execute(id: string): Promise<Either<DataError, NewsFeedData>> {
        return await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(
                () =>
                    ({
                        kind: "UnexpectedError",
                        message: new Error(`Unexpected news feed id to delete ${id}`),
                    } as DataError)
            )
            .flatMap<NewsFeed>(id => this.newsFeedRepository.getById(id))
            .map(newsFeed => newsFeed.toData())
            .run();
    }
}
