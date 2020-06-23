import { GetUserError } from "./Errors";
import { Either, User } from "karate-stars-core";
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
