import UserRepository from "../../domain/users/boundaries/UserRepository";
import { User, Maybe } from "karate-stars-core";
import * as MongoClient from "mongodb";
import { UserDB } from "./UserDB";

export default class UserMongoRepository implements UserRepository {
    constructor(private mongodbConecction: string) {}

    public async getByUsernameAndPassword(
        username: string,
        password: string
    ): Promise<Maybe<User>> {
        const users = await this.getUsers();
        const result = Maybe.fromValue(
            users.find(u => u.username === username && u.password === password)
        );

        return result.map(userDB => this.mapToDomain(userDB));
    }

    public async getByUserId(userId: string): Promise<Maybe<User>> {
        const users = await this.getUsers();
        const result = Maybe.fromValue(users.find(u => u._id === userId));

        return result.map(userDB => this.mapToDomain(userDB));
    }

    private getUsers(): Promise<UserDB[]> {
        return new Promise((resolve, reject) => {
            const mongoClient = new MongoClient.MongoClient(this.mongodbConecction, {
                useUnifiedTopology: true,
            });

            // Use connect method to connect to the Server
            mongoClient.connect(async (errCon, client) => {
                if (errCon) {
                    reject(errCon);
                }

                const cursor = client.db().collection("users").find<UserDB>();

                const rows = await cursor.toArray();

                resolve(rows);

                client.close();
            });
        });
    }

    private mapToDomain(userDB: UserDB): User {
        const user = this.renameProp<UserDB, User>("_id", "userId", userDB);

        return user;
    }

    private renameProp<Input, Output>(
        oldProp: keyof Input,
        newProp: keyof Output,
        old: Input
    ): Output {
        const output = Object.keys(old).reduce((acc, key) => {
            const finalKey = key === oldProp ? newProp : key;
            const result = { ...acc, [finalKey]: old[key] };
            return result;
        }, {} as Output);

        return output;
    }
}
