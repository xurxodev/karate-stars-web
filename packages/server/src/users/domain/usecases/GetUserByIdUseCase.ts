import UserRepository from "../boundaries/UserRepository";
import { Maybe, UserData, Id } from "karate-stars-core";

export default class GetUserByIdUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public async execute(userId: string): Promise<Maybe<UserData>> {
        const userResult = await this.repository.getById(Id.createExisted(userId).getOrThrow());

        return userResult.map(user => user.toData());
    }
}
