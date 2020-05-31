import User from "./entities/User";
import { Either } from "../../common/domain/Either";
import { GetUserError } from "./Errors";
import { Email } from "./entities/Email";
import { Password } from "./entities/Password";

export default interface UserRepository {
    getByEmailAndPassword(email: Email, password: Password): Promise<Either<GetUserError, User>>;
    getCurrent(): Promise<Either<GetUserError, User>>;
    removeCurrent(): Promise<void>;
}
