import UserRepository from "./LoginRepository";
import { UserError } from "./Errors";
import { Email } from "./Email";
import { Password } from "./Password";
import { Either } from "../../common/domain/Either";
import User from "./User";

export default class LoginUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute(email: Email, password: Password): Promise<Either<UserError, User>> {
        return this.userRepository.getByEmailAndPassword(email, password);
    }
}