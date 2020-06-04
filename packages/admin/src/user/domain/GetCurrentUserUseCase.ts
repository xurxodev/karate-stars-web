import { GetUserError } from "./Errors";
import { Either } from "karate-stars-core";
import User from "./entities/User";
import UserRepository from "./Boundaries";

export default class GetCurrentUserUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute(): Promise<Either<GetUserError, User>> {
        return this.userRepository.getCurrent();
    }
}
