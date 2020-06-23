import { Either, Email, Password, User } from "karate-stars-core";
import { GetUserError } from "./Errors";

export default interface UserRepository {
    getByEmailAndPassword(email: Email, password: Password): Promise<Either<GetUserError, User>>;
    getCurrent(): Promise<Either<GetUserError, User>>;
    removeCurrent(): Promise<void>;
}
