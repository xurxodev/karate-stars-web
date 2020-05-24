
import { GetUserError } from "./Errors";
import { Either } from "../../common/domain/Either";
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