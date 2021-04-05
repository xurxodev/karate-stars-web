import { Email, Maybe, Password, User, UserData } from "karate-stars-core";
import { FakeGenericRepository } from "./FakeGenericRepository";

export class FakeUserRepository extends FakeGenericRepository<UserData, User> {
    getByUsernameAndPassword(username: Email, password: Password): Promise<Maybe<User>> {
        const result = Maybe.fromValue(
            this.items.find(
                u => u.email.value === username.value && u.password.value === password.value
            )
        );

        return Promise.resolve(result);
    }
}
