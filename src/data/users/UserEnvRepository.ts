import UserRepository from "../../domain/users/boundaries/UserRepository";
import User from "../../domain/users/entities/User";

export default class UserEnvRepository implements UserRepository {
    public users = [
        {
            userId: "b17e09fc-d2da-4b0a-b34a-90ecb7e082ec",
            name: "Jorge Sánchez",
            username: process.env.USERNAME,
            password: process.env.USER_PASSWORD
        }
    ];

    public getByUsername(username: string): Promise<User> {
        const user = this.users.find((p) => p.username === username);

        return new Promise((resolve, reject) => {
            if (user) {
                resolve(user);
            } else {
                reject(`Does not exist an user with username ${username}`);
            }

        });
    }

    public getByUserId(userId: string): Promise<User> {
        const user = this.users.find((p) => p.userId === userId);

        return new Promise((resolve, reject) => {
            if (user) {
                resolve(user);
            } else {
                reject(`Does not exist an user with userId ${userId}`);
            }

        });
    }
}
