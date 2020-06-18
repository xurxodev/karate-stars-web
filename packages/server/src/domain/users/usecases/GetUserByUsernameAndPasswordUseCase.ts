import UserRepository from "../boundaries/UserRepository";
import { User, Maybe } from "karate-stars-core";

export default class GetUserByUsernameAndPasswordUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public execute(userName: string, password: string): Promise<Maybe<User>> {
        return this.repository.getByUsernameAndPassword(userName, password);
    }
}
