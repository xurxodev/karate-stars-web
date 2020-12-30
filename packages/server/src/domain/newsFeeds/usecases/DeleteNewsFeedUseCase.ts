import { Either, EitherAsync, Id, MaybeAsync } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../api/common/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../common/AdminUseCase";
import { ImageRepository } from "../../images/boundaries/ImageRepository";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface ActionResult {
    ok: boolean;
    count: number;
}

export interface GetNewsFeedByIdArg extends AdminUseCaseArgs {
    id: string;
}

type DeleteNewsFeedError = ResourceNotFoundError | UnexpectedError;

export class DeleteNewsFeedUseCase extends AdminUseCase<
    GetNewsFeedByIdArg,
    DeleteNewsFeedError,
    ActionResult
> {
    constructor(
        private newsFeedsRepository: NewsFeedsRepository,
        userRepository: UserRepository,
        private imageRepository: ImageRepository
    ) {
        super(userRepository);
    }

    public async run({
        id,
    }: GetNewsFeedByIdArg): Promise<Either<DeleteNewsFeedError, ActionResult>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${id} not found`,
        } as DeleteNewsFeedError;

        const result = await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(() => notFoundError)
            .flatMap(async id =>
                MaybeAsync.fromPromise(this.newsFeedsRepository.getById(id)).toEither(notFoundError)
            )
            .flatMap<Id>(async newsFeed =>
                this.deleteImage(newsFeed.image?.value)
                    .map(() => newsFeed.id)
                    .run()
            )
            .flatMap<ActionResult>(async id => {
                const deleteResult = await this.newsFeedsRepository.delete(id);

                return deleteResult.count > 0
                    ? Either.right(deleteResult)
                    : Either.left(notFoundError);
            })
            .run();

        return result;
    }

    private deleteImage(imageUrl?: string): EitherAsync<UnexpectedError, true> {
        const filename = imageUrl ? imageUrl.split("/").pop() : undefined;

        if (filename) {
            return EitherAsync.fromPromise(this.imageRepository.deleteImage("feeds", filename));
        } else {
            return EitherAsync.fromEither(Either.right(true));
        }
    }
}
