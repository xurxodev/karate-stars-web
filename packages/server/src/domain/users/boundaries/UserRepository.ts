import { User, Maybe, Id, Email, Password } from "karate-stars-core";

export default interface UserRepository<> {
    getByUsernameAndPassword(username: Email, password: Password): Promise<Maybe<User>>;
    getById(userId: Id): Promise<Maybe<User>>;
}
