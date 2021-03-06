import { Either, EitherAsync, Id, NewsFeedRawData, MaybeAsync } from "karate-stars-core";
import { ResourceNotFoundError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface GetNewsFeedByIdArg extends AdminUseCaseArgs {
    id: string;
}

export class GetNewsFeedByIdUseCase extends AdminUseCase<
    GetNewsFeedByIdArg,
    ResourceNotFoundError,
    NewsFeedRawData
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetNewsFeedByIdArg): Promise<Either<ResourceNotFoundError, NewsFeedRawData>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${id} not found`,
        } as ResourceNotFoundError;

        const result = await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(() => notFoundError)
            .flatMap(id =>
                MaybeAsync.fromPromise(this.newsFeedsRepository.getById(id)).toEither(notFoundError)
            )
            .map(newsFeed => newsFeed.toRawData())
            .run();

        return result;
    }
}
