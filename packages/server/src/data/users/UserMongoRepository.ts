import UserRepository from "../../domain/users/boundaries/UserRepository";
import { User, Maybe, Id, Email, Password } from "karate-stars-core";
import { UserDB } from "./UserDB";
import { MongoConector } from "../common/MongoConector";

export default class UserMongoRepository implements UserRepository {
    constructor(private mongoConector: MongoConector) {}

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

    private async getUsers(): Promise<UserDB[]> {
        const db = await this.mongoConector.db();

        const cursor = db.collection("users").find<UserDB>();

        const rows = await cursor.toArray();

        return rows;
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
