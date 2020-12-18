import { Either, EitherAsync, Id, MaybeAsync } from "karate-stars-core";
import stream from "stream";
import {
    ResourceNotFoundError,
    UnexpectedError,
    ValidationError,
} from "../../../api/common/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../common/AdminUseCase";
import { ImageRepository } from "../../images/boundaries/ImageRepository";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface ActionResult {
    ok: boolean;
    count: number;
}

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    itemId: string;
    filename: string;
    image: stream.Readable;
}

type UpdateNewsFeedImageError = ResourceNotFoundError | ValidationError | UnexpectedError;

export class UpdateNewsFeedImageUseCase extends AdminUseCase<
    CreateNewsFeedArg,
    UpdateNewsFeedImageError,
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
        itemId,
        filename,
        image,
    }: CreateNewsFeedArg): Promise<Either<UpdateNewsFeedImageError, ActionResult>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${itemId} not found`,
        } as ResourceNotFoundError;

        return await EitherAsync.fromEither(Id.createExisted(itemId))
            .mapLeft<UpdateNewsFeedImageError>(() => notFoundError)
            .flatMap(async id =>
                MaybeAsync.fromPromise(this.newsFeedsRepository.getById(id)).toEither(notFoundError)
            )
            .flatMap(async existedFeed => {
                const item = existedFeed.toRawData();

                return EitherAsync.fromPromise(
                    this.imageRepository.uploadNewFile("feeds", filename, image)
                )
                    .mapLeft(error => error as UpdateNewsFeedImageError)
                    .flatMap(async newImageUrl =>
                        existedFeed.update({ ...item, image: newImageUrl }).mapLeft(error => ({
                            kind: "ValidationError",
                            errors: error,
                        }))
                    )
                    .run();
            })
            .flatMap(async entity => {
                const saveResult = await this.newsFeedsRepository.save(entity);

                return saveResult.ok
                    ? Either.right(saveResult)
                    : Either.left<UpdateNewsFeedImageError, ActionResult>({
                          kind: "UnexpectedError",
                          error: new Error("An error has ocurred updating the news feed"),
                      });
            })
            .run();
    }
}
