import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { ValidationErrors } from "../types/Errors";
import { validateRequired, validateRegexp } from "../utils/validations";

export interface UserEmailProps {
    value: string;
}

const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class Email extends ValueObject<UserEmailProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UserEmailProps) {
        super(props);
    }

    public static create(email: string): Either<ValidationErrors, Email> {
        const requiredError = validateRequired(email);
        const regexpErrors = validateRegexp(email, EMAIL_PATTERN);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else if (regexpErrors.length > 0) {
            return Either.left(regexpErrors);
        } else {
            return Either.right(new Email({ value: this.format(email) }));
        }
    }

    private static format(email: string): string {
        return email.trim().toLowerCase();
    }
}
