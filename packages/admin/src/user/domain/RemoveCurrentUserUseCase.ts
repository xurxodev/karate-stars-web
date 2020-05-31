import UserRepository from "./Boundaries";

export default class RemoveCurrentUserUseCase {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    execute(): Promise<void> {
        return this.userRepository.removeCurrent();
    }
}
