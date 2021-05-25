import { Either, EitherAsync, Id, NewsFeed, NewsFeedData } from "karate-stars-core";
import stream from "stream";
import { ActionResult } from "../../../common/api/ActionResult";
import {
    ResourceNotFoundError,
    UnexpectedError,
    ValidationErrors,
} from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { updateImageResource } from "../../../common/domain/UpdateImageResource";
import { ImageRepository } from "../../../images/domain/ImageRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface CreateNewsFeedArg extends AdminUseCaseArgs {
    id: string;
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
        id,
        filename,
        image,
    }: CreateNewsFeedArg): Promise<Either<UpdateNewsFeedImageError, ActionResult>> {
        const updateEntity = (entity: NewsFeed, imageUrl: string) =>
            entity.update({ ...entity.toData(), image: imageUrl });
        const getById = (id: Id) => this.newsFeedsRepository.getById(id);
        const saveEntity = (entity: NewsFeed) => this.newsFeedsRepository.save(entity);
        const uploadNewImage = () => this.imageRepository.uploadNewImage("feeds", filename, image);

        return updateImageResource(
            id,
            getById,
            this.deletePreviousImage,
            uploadNewImage,
            updateEntity,
            saveEntity
        );
    }
    private deletePreviousImage(entity: NewsFeed): EitherAsync<UnexpectedError, true> {
        const filename = entity.image ? entity.image.value.split("/").pop() : undefined;

        if (filename) {
            return EitherAsync.fromPromise(this.imageRepository.deleteImage("feeds", filename));
        } else {
            return EitherAsync.fromEither(Either.right(true));
        }
    }
}
