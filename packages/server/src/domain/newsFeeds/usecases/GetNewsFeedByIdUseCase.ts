import { Either, EitherAsync, Id, NewsFeedRawData, MaybeAsync } from "karate-stars-core";
import { ResourceNotFound } from "../../../api/common/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../common/AdminUseCase";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface GetNewsFeedByIdArg extends AdminUseCaseArgs {
    id: string;
}

export class GetNewsFeedByIdUseCase extends AdminUseCase<
    GetNewsFeedByIdArg,
    ResourceNotFound,
    NewsFeedRawData
> {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetNewsFeedByIdArg): Promise<Either<ResourceNotFound, NewsFeedRawData>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${id} not found`,
        } as ResourceNotFound;

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
