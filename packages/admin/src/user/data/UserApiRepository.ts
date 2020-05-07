import { Email } from "../domain/entities/Email";
import { Password } from "../domain/entities/Password";
import { Either } from "../../common/domain/Either";
import { UserError } from "../domain/Errors";
import User from "../domain/entities/User";
import UserRepository from "../domain/Boundaries";

export default class UserApiRepository implements UserRepository {
    async getByEmailAndPassword(email: Email, password: Password): Promise<Either<UserError, User>> {
        //return Either.right({ userId: "fake" });
        return Either.left({ kind: "ApiError", message: "faking error" });
    }

}