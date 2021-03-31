import { Either, EitherAsync, Id } from "karate-stars-core";
import { ActionResult } from "../../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
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
        const result = await createIdOrResourceNotFound<DeleteNewsFeedError>(id)
            .flatMap(async id => this.newsFeedsRepository.getById(id))
            .flatMap<Id>(async newsFeed =>
                this.deleteImage(newsFeed.image?.value)
                    .map(() => newsFeed.id)
                    .run()
            )
            .flatMap<ActionResult>(id => this.newsFeedsRepository.delete(id))
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
