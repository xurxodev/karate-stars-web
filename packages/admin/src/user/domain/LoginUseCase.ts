
import { UserError } from "./Errors";
import { Email } from "./entities/Email";
import { Password } from "./entities/Password";
import { Either } from "../../common/domain/Either";
import User from "./entities/User";
import UserRepository from "./Boundaries";

export default class LoginUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute(email: Email, password: Password): Promise<Either<UserError, User>> {
        return this.userRepository.getByEmailAndPassword(email, password);
    }
}