import UserRepository from "../boundaries/UserRepository";
import { UserData, Maybe, Email, Password } from "karate-stars-core";

export default class GetUserByUsernameAndPasswordUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public execute(email: string, password: string): Promise<Maybe<UserData>> {
        return this.repository.getByUsernameAndPassword(
            Email.create(email).getOrThrow(),
            Password.create(password).getOrThrow()
        );
    }
}
