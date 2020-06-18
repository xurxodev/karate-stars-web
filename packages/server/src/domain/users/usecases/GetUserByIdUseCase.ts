import UserRepository from "../boundaries/UserRepository";
import { User, Maybe } from "karate-stars-core";

export default class GetUserByIdUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public execute(userId: string): Promise<Maybe<User>> {
        return this.repository.getByUserId(userId);
    }
}
