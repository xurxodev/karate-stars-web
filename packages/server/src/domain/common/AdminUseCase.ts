import { Either, Id, User } from "karate-stars-core";
import { PermissionError } from "../../api/authentication/PermisionError";
import { ResourceNotFound, UnexpectedError } from "../../api/common/Errors";
import UserRepository from "../users/boundaries/UserRepository";

export interface AdminUseCaseArgs {
    userId: string;
}

export type AdminUseCaseError = ResourceNotFound | PermissionError | UnexpectedError;

export abstract class AdminUseCase<Arguments extends AdminUseCaseArgs, Error, Data> {
    constructor(private userRepository: UserRepository) {}

    public abstract async run(arg: Arguments): Promise<Either<Error, Data>>;

    public async execute(arg: Arguments): Promise<Either<AdminUseCaseError | Error, Data>> {
        try {
            const validationResult = await this.validateUser(arg.userId);

            return validationResult.fold<Promise<Either<AdminUseCaseError | Error, Data>>>(
                async userError => Either.left(userError),
                async () => this.run(arg)
            );
        } catch (error) {
            return Either.left({
                kind: "UnexpectedError",
                error: error,
            });
        }
    }

    private async validateUser(userId: string): Promise<Either<AdminUseCaseError | Error, true>> {
        const notFoundError = {
            kind: "ResourceNotFound",
            message: `NewsFeed with id ${userId} not found`,
        } as ResourceNotFound;

        const userResult = await Id.createExisted(userId).fold<
            Promise<Either<ResourceNotFound, User>>
        >(
            async () => Either.left(notFoundError),
            async id => (await this.userRepository.getByUserId(id)).toEither(notFoundError)
        );

        return userResult.fold(
            error => Either.left(error),
            user =>
                !user.isAdmin
                    ? Either.left({
                          kind: "PermissionError",
                          message: `You have not permissions to access to this resource. Only admin users can accesss to this resource`,
                      } as PermissionError)
                    : Either.right(true)
        );
    }
}
