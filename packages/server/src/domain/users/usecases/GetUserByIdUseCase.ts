import UserRepository from "../boundaries/UserRepository";
import { Maybe, UserData, Id } from "karate-stars-core";

export default class GetUserByIdUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public execute(userId: string): Promise<Maybe<UserData>> {
        return this.repository.getByUserId(Id.createExisted(userId).getOrThrow());
    }
}
