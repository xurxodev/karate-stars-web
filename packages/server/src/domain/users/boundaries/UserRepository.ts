import { User, Maybe } from "karate-stars-core";

export default interface UserRepository<> {
    getByUsernameAndPassword(username: string, password: string): Promise<Maybe<User>>;
    getByUserId(userId: string): Promise<Maybe<User>>;
}
