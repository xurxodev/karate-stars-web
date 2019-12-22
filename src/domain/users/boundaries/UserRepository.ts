import User from "../entities/User";

export default interface UserRepository<> {
    getByUsername(username: string): Promise<User>;
    getByUserId(userId: string): Promise<User>;
}
