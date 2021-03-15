import { Password } from "./Password";
import { Email } from "./Email";
import { ValidationError } from "../types/Errors";
import { Either } from "../types/Either";
import { ValueObject } from "./ValueObject";

export interface CredentialsData {
    email: Email;
    password: Password;
}

export class Credentials extends ValueObject<CredentialsData> implements CredentialsData {
    public readonly email: Email;
    public readonly password: Password;

    private constructor(data: CredentialsData) {
        super(data);
        this.email = data.email;
        this.password = data.password;
    }

    public static create(data: {
        email: string;
        password: string;
    }): Either<ValidationError<Credentials>[], Credentials> {
        const emailResult = Email.create(data.email);
        const passwordResult = Password.create(data.password);

        const errors: ValidationError<Credentials>[] = [
            {
                property: "email" as const,
                errors: emailResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.email,
            },
            {
                property: "password" as const,
                errors: passwordResult.fold(
                    errors => errors,
                    () => []
                ),
                value: data.password,
            },
        ]
            .map(error => ({ ...error, type: Credentials.name }))
            .filter(validation => validation.errors.length > 0);

        if (errors.length === 0) {
            return Either.right(
                new Credentials({ email: emailResult.get(), password: passwordResult.get() })
            );
        } else {
            return Either.left(errors);
        }
    }
}
