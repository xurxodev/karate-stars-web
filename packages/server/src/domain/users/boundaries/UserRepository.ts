import { User, Maybe, Id, Email, Password } from "karate-stars-core";

export default interface UserRepository<> {
    getByUsernameAndPassword(username: Email, password: Password): Promise<Maybe<User>>;
    getByUserId(userId: Id): Promise<Maybe<User>>;
}
