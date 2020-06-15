import { User } from "karate-stars-core";

export default interface UserRepository<> {
    getByUsername(username: string): Promise<User>;
    getByUserId(userId: string): Promise<User>;
}
