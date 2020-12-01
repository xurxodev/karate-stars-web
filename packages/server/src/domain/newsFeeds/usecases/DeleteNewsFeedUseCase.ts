import { Either, EitherAsync, Id } from "karate-stars-core";
import { ResourceNotFoundError } from "../../../api/common/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../common/AdminUseCase";
import UserRepository from "../../users/boundaries/UserRepository";
import NewsFeedsRepository from "../boundaries/NewsFeedRepository";

export interface ActionResult {
    ok: boolean;
    count: number;
}

export interface GetNewsFeedByIdArg extends AdminUseCaseArgs {
    id: string;
}

export class DeleteNewsFeedUseCase extends AdminUseCase<
    GetNewsFeedByIdArg,
    ResourceNotFoundError,
    ActionResult
    > {
    constructor(private newsFeedsRepository: NewsFeedsRepository, userRepository: UserRepository) {
        super(userRepository);
    }

    public async run({ id }: GetNewsFeedByIdArg): Promise<Either<ResourceNotFoundError, ActionResult>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${id} not found`,
        } as ResourceNotFoundError;

        const result = await EitherAsync.fromEither(Id.createExisted(id))
            .mapLeft(() => notFoundError)
            .flatMap<ActionResult>(async id => {
                const deleteResult = await this.newsFeedsRepository.delete(id);

                return deleteResult.count > 0
                    ? Either.right(deleteResult)
                    : Either.left(notFoundError);
            })
            .run();

        return result;
    }
}
