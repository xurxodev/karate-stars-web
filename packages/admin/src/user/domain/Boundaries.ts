import User from "./entities/User";
import { Either } from "../../common/domain/Either";
import { UserError } from "./Errors";
import { Email } from "./entities/Email";
import { Password } from "./entities/Password";

export default interface UserRepository {
    getByEmailAndPassword(email: Email, password: Password): Promise<Either<UserError, User>>;
}