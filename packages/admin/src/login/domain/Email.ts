import { ValueObject } from "../../common/domain/ValueObject";
import { Either, Left, Right } from "../../common/domain/Either";


export type EmailError = "InvalidEmail" | "InvalidEmptyEmail"

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
        if (!this.isValidEmail(email)) {
            return Left<EmailError>("InvalidEmail")
        } else {
            return Right(new Email({ value: this.format(email) }));
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