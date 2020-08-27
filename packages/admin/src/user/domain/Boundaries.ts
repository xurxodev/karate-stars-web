import { Either, User, Credentials } from "karate-stars-core";
import { GetUserError } from "./Errors";

export default interface UserRepository {
    getByEmailAndPassword(credentials: Credentials): Promise<Either<GetUserError, User>>;
    getCurrent(): Promise<Either<GetUserError, User>>;
    removeCurrent(): Promise<void>;
}
