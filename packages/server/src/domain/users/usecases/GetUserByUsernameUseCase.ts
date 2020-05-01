import UserRepository from "../boundaries/UserRepository";
import User from "../entities/User";

export default class GetUserByUsernameUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public execute(userName: string): Promise<User> {
        return this.repository.getByUsername(userName);
    }
}
