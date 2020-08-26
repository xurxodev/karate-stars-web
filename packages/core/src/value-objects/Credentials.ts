import { Password } from "./Password";
import { Email } from "./Email";
import { ValidationErrorsDictionary } from "../types/Errors";
import { Either } from "../types/Either";
import { ValueObject } from "./ValueObject";

export interface CredentialsData {
    email: Email;
    password: Password;
}

export interface CredentialsInput {
    email: string;
    password: string;
}

export class Credentials extends ValueObject<CredentialsData> implements CredentialsData {
    public readonly email: Email;
    public readonly password: Password;

    private constructor(data: CredentialsData) {
        super(data);
        this.email = data.email;
        this.password = data.password;
    }

    public static create(input: CredentialsInput): Either<ValidationErrorsDictionary, Credentials> {
        const email = Email.create(input.email);
        const password = Password.create(input.password);

        const errors: ValidationErrorsDictionary = {
            email: email.fold(
                errors => errors,
                () => []
            ),
            password: password.fold(
                errors => errors,
                () => []
            ),
        };

        Object.keys(errors).forEach(
            (key: string) => errors[key].length === 0 && delete errors[key]
        );

        if (Object.keys(errors).length === 0) {
            return Either.right(
                new Credentials({ email: email.getOrThrow(), password: password.getOrThrow() })
            );
        } else {
            return Either.left(errors);
        }
    }
}
