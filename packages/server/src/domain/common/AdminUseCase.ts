import { Either, Id } from "karate-stars-core";
import { PermissionError } from "../../api/authentication/PermisionError";
import { ResourceNotFound, UnexpectedError } from "../../api/common/Errors";
import UserRepository from "../users/boundaries/UserRepository";

export interface WithUserIdArgs {
    userId: string;
}

export type AdminUseCaseError = ResourceNotFound | PermissionError | UnexpectedError;

export abstract class AdminUseCase<Arguments extends WithUserIdArgs, Data> {
    constructor(private userRepository: UserRepository) {}

    public abstract async run(arg: Arguments): Promise<Either<AdminUseCaseError, Data>>;

    public async execute(arg: Arguments): Promise<Either<AdminUseCaseError, Data>> {
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

        // try with fold

        if (idResult.isLeft()) {
            return {
                kind: "ResourceNotFound",
                message: `User with id ${userId} not found`,
            };
        } else {
            return await this.validateIdUserIsAdmin(idResult.get());
        }
    }

    private async validateIdUserIsAdmin(userId: Id): Promise<AdminUseCaseError | null> {
        const userResult = await this.userRepository.getByUserId(userId);

        // try with fold

        if (!userResult.isDefined()) {
            return {
                kind: "ResourceNotFound",
                message: `User with id ${userId.value} not found`,
            };
        } else if (!userResult.get().isAdmin) {
            return {
                kind: "PermissionError",
                message: `You have not permissions to access to this resource. Only admin users can accesss to this resource`,
            };
        } else {
            return null;
        }
    }
}
