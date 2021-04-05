import UserRepository from "../boundaries/UserRepository";
import { UserData, Maybe, Email, Password } from "karate-stars-core";

export default class GetUserByUsernameAndPasswordUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public async execute(email: string, password: string): Promise<Maybe<UserData>> {
        const userResult = await this.repository.getByUsernameAndPassword(
            Email.create(email).getOrThrow(),
            Password.create(password).getOrThrow()
        );

        return userResult.map(user => user.toData());
    }
}
