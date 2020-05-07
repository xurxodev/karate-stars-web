import UserRepository from "../domain/LoginRepository";
import { Email } from "../domain/Email";
import { Password } from "../domain/Password";
import { Either } from "../../common/domain/Either";
import { UserError } from "../domain/Errors";
import User from "../domain/User";

export default class UserApiRepository implements UserRepository {
    async getByEmailAndPassword(email: Email, password: Password): Promise<Either<UserError, User>> {
        //return Either.right({ userId: "fake" });
        return Either.left({ kind: "ApiError", message: "faking error" });
    }

}