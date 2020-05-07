import User from "./User";
import { Either } from "../../common/domain/Either";
import { UserError } from "./Errors";
import { Email } from "./Email";
import { Password } from "./Password";

export default interface UserRepository {
    getByEmailAndPassword(email: Email, password: Password): Promise<Either<UserError, User>>;
}