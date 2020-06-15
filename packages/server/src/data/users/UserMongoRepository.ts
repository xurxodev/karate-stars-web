import UserRepository from "../../domain/users/boundaries/UserRepository";
import { User } from "karate-stars-core";
import * as MongoClient from "mongodb";

export default class UserMongoRepository implements UserRepository {
    constructor(private mongodbConecction: string) {}

    public async getByUsername(username: string): Promise<User> {
        const users = await this.getUsers();

        console.log(users);
        const user = users.find(p => p.username === username);

        console.log(user);

        return new Promise((resolve, reject) => {
            if (user) {
                resolve(user);
            } else {
                reject(`Does not exist an user with username ${username}`);
            }
        });
    }

    public async getByUserId(userId: string): Promise<User> {
        debugger;
        const users = await this.getUsers();
        debugger;
        const user = users.find(p => p.userId === userId);

        return new Promise((resolve, reject) => {
            if (user) {
                resolve(user);
            } else {
                reject(`Does not exist an user with userId ${userId}`);
            }
        });
    }

    private getUsers(): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const mongoClient = new MongoClient.MongoClient(this.mongodbConecction, {
                useUnifiedTopology: true,
            });

            // Use connect method to connect to the Server
            mongoClient.connect(async (errCon, client) => {
                if (errCon) {
                    reject(errCon);
                }

                const cursor = client.db().collection("users").find<User>();

                const rows = await cursor.toArray();

                console.log({ cursor });

                resolve(rows);

                client.close();
            });
        });
    }
}
