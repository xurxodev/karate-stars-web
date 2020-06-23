import { GetUserError } from "./Errors";
import { Either, Email, Password, User } from "karate-stars-core";
import UserRepository from "./Boundaries";

export default class LoginUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute(email: Email, password: Password): Promise<Either<GetUserError, User>> {
        return this.userRepository.getByEmailAndPassword(email, password);
    }
}
