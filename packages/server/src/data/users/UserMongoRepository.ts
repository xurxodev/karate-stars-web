import UserRepository from "../../domain/users/boundaries/UserRepository";
import { User, Maybe, Id, Email, Password } from "karate-stars-core";
import * as MongoClient from "mongodb";
import { UserDB } from "./UserDB";

export default class UserMongoRepository implements UserRepository {
    constructor(private mongodbConecction: string) {}

    public async getByUsernameAndPassword(
        username: Email,
        password: Password
    ): Promise<Maybe<User>> {
        const users = await this.getUsers();
        const result = Maybe.fromValue(
            users.find(u => u.username === username.value && u.password === password.value)
        );

        return result.map(userDB => this.mapToDomain(userDB));
    }

    public async getByUserId(userId: Id): Promise<Maybe<User>> {
        const users = await this.getUsers();
        const result = Maybe.fromValue(users.find(u => u._id === userId.value));

        return result.map(userDB => this.mapToDomain(userDB));
    }

    private getUsers(): Promise<UserDB[]> {
        return new Promise((resolve, reject) => {
            const mongoClient = new MongoClient.MongoClient(this.mongodbConecction, {
                useUnifiedTopology: true,
            });

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
        const user = User.createExisted({
            id: Id.createExisted(userDB._id).getOrThrow(),
            name: userDB.name,
            image: userDB.image,
            email: Email.create(userDB.username).getOrThrow(),
            password: Password.create(userDB.password).getOrThrow(),
            isAdmin: userDB.isAdmin,
            isClientUser: userDB.isClientUser,
        });

        return user;
    }
}
