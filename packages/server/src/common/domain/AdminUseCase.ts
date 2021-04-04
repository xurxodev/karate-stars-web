import { Either, EitherAsync, Id, MaybeAsync } from "karate-stars-core";
import { PermissionError } from "../../authentication/PermisionError";
import { UnauthorizedError, UnexpectedError } from "../../common/api/Errors";
import UserRepository from "../../users/domain/boundaries/UserRepository";

export interface AdminUseCaseArgs {
    userId: string;
}

export type AdminUseCaseError = UnauthorizedError | PermissionError | UnexpectedError;

export abstract class AdminUseCase<Arguments extends AdminUseCaseArgs, Error, Data> {
    constructor(private userRepository: UserRepository) {}

    protected abstract run(arg: Arguments): Promise<Either<Error, Data>>;

    public async execute(arg: Arguments): Promise<Either<AdminUseCaseError | Error, Data>> {
        try {
            const validationResult = await this.validateUser(arg.userId);

            const result = validationResult.fold<Promise<Either<AdminUseCaseError | Error, Data>>>(
                async userError => Either.left(userError),
                async () => this.run(arg)
            );
            return result;
        } catch (error) {
            return Either.left({
                kind: "UnexpectedError",
                error: error,
            });
        }
    }

    private async validateUser(userId: string): Promise<Either<AdminUseCaseError | Error, true>> {
        const notFoundError = {
            kind: "Unauthorized",
            message: `User with id ${userId} not found`,
        } as UnauthorizedError;

        const permissionError = {
            kind: "PermissionError",
            message: `You have not permissions to access to this resource. Only admin users can accesss to this resource`,
        } as PermissionError;

        const userResult = await EitherAsync.fromEither(Id.createExisted(userId))
            .mapLeft(() => notFoundError)
            .flatMap(id =>
                MaybeAsync.fromPromise(this.userRepository.getById(id)).toEither(notFoundError)
            )
            .run();

        return userResult.fold(
            error => Either.left(error),
            user => (!user.isAdmin ? Either.left(permissionError) : Either.right(true))
        );
    }
}
