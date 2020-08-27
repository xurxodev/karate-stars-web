import { GetUserError } from "./Errors";
import { Either, User, Credentials } from "karate-stars-core";
import UserRepository from "./Boundaries";

export default class LoginUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute(credentials: Credentials): Promise<Either<GetUserError, User>> {
        return this.userRepository.getByEmailAndPassword(credentials);
    }
}
