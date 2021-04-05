import { Either, EitherAsync, NewsFeedData } from "karate-stars-core";
import stream from "stream";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import { ImageRepository } from "../../../images/domain/ImageRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    itemId: string;
    filename: string;
    image: stream.Readable;
}

type UpdateNewsFeedImageError =
    | ResourceNotFoundError
    | ValidationErrors<NewsFeedData>
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
        return await createIdOrResourceNotFound<UpdateNewsFeedImageError>(itemId)
            .flatMap(async id => this.newsFeedsRepository.getById(id))
            .flatMap(async existedFeed => {
                const item = existedFeed.toData();

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
            .flatMap(entity => this.newsFeedsRepository.save(entity))
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
