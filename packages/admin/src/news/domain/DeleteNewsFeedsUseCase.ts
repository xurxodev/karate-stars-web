import { NewsFeedRepository } from "./Boundaries";
import { Either, EitherAsync, Id } from "karate-stars-core";
import { DataError } from "../../common/domain/Errors";

export default class DeleteNewsFeedsUseCase {
    constructor(private newsFeedRepository: NewsFeedRepository) {}

    async execute(id: string): Promise<Either<DataError, true>> {
        const result = await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(
                () =>
                    ({
                        kind: "UnexpectedError",
                        message: new Error(`Unexpected news feed id to delete ${id}`),
                    } as DataError)
            )
            .flatMap(async id => this.newsFeedRepository.deleteById(id))
            .run();

        return result;
    }
}
