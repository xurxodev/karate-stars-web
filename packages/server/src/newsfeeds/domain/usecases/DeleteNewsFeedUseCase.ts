import { Either, EitherAsync, Id, NewsFeed } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { deleteResourceWithImage } from "../../../common/domain/DeleteResource";
import { ImageRepository } from "../../../images/domain/ImageRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

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
    }: GetNewsFeedByIdArg): Promise<Either<ResourceNotFoundError | UnexpectedError, ActionResult>> {
        const getById = (id: Id) => this.newsFeedsRepository.getById(id);
        const deleteEntity = (id: Id) => this.newsFeedsRepository.delete(id);
        const deleteImage = (entity: NewsFeed): EitherAsync<UnexpectedError, true> => {
            const filename = entity.image ? entity.image.value.split("/").pop() : undefined;

            if (filename) {
                return EitherAsync.fromPromise(this.imageRepository.deleteImage("feeds", filename));
            } else {
                return EitherAsync.fromEither(Either.right(true));
            }
        };

        return deleteResourceWithImage(id, getById, deleteImage, deleteEntity);
    }
}
