import { Either, Id } from "karate-stars-core";
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
            const userError = await this.validateUserId(arg.userId);

            if (!userError) {
                return this.run(arg);
            } else {
                return Either.left(userError);
            }
        } catch (error) {
            return Either.left({
                kind: "UnexpectedError",
                error: error,
            });
        }
    }

    private async validateUserId(userId: string): Promise<AdminUseCaseError | null> {
        const idResult = Id.createExisted(userId);

        return await idResult.fold<Promise<AdminUseCaseError | null>>(
            async () => ({
                kind: "ResourceNotFound",
                message: `User with id ${userId} not found`,
            }),
            async () => this.validateIdUserIsAdmin(idResult.get())
        );
    }

    private async validateIdUserIsAdmin(userId: Id): Promise<AdminUseCaseError | null> {
        const userResult = await this.userRepository.getByUserId(userId);

        return userResult.fold<AdminUseCaseError | null>(
            () => ({
                kind: "ResourceNotFound",
                message: `User with id ${userId.value} not found`,
            }),
            user =>
                user.isAdmin
                    ? null
                    : {
                          kind: "PermissionError",
                          message: `You have not permissions to access to this resource. Only admin users can accesss to this resource`,
                      }
        );
    }
}
