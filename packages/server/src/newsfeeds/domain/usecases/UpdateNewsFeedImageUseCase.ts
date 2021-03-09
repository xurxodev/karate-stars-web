import { Either, EitherAsync, Id, MaybeAsync, NewsFeed } from "karate-stars-core";
import stream from "stream";
import {
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { ImageRepository } from "../../../images/domain/ImageRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
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

type UpdateNewsFeedImageError =
    | ResourceNotFoundError
    | ValidationErrors<NewsFeed>
    | UnexpectedError;

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

                return this.deletePreviousImage(existedFeed.image?.value)
                    .flatMap(() => this.imageRepository.uploadNewImage("feeds", filename, image))
                    .mapLeft(error => error as UpdateNewsFeedImageError)
                    .flatMap(async newImageUrl =>
                        existedFeed.update({ ...item, image: newImageUrl }).mapLeft(error => ({
                            kind: "ValidationErrors",
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

    private deletePreviousImage(imageUrl?: string): EitherAsync<UnexpectedError, true> {
        const filename = imageUrl ? imageUrl.split("/").pop() : undefined;

        if (filename) {
            return EitherAsync.fromPromise(this.imageRepository.deleteImage("feeds", filename));
        } else {
            return EitherAsync.fromEither(Either.right(true));
        }
    }
}
