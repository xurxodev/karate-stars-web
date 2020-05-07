import { ValueObject } from "../../common/domain/ValueObject";
import { Either } from "../../common/domain/Either";

export interface InvalidEmail {
    kind: "InvalidEmail";
}

export interface InvalidEmptyEmail {
    kind: "InvalidEmptyEmail";
}

export type EmailError = InvalidEmail | InvalidEmptyEmail

export interface UserEmailProps {
    value: string;
}

export class Email extends ValueObject<UserEmailProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: UserEmailProps) {
        super(props);
    }

    public static create(email: string): Either<EmailError, Email> {
        if (!email) {
            return Either.left({ kind: "InvalidEmptyEmail" })
        } else if (!this.isValidEmail(email)) {
            return Either.left({ kind: "InvalidEmail" })
        } else {
            return Either.right(new Email({ value: this.format(email) }));
        }
    }

    private static isValidEmail(email: string) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    private static format(email: string): string {
        return email.trim().toLowerCase();
    }
}