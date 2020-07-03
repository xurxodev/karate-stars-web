import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";

export interface PasswordProps {
    value: string;
}

export interface InvalidEmptyPassword {
    kind: "InvalidEmptyPassword";
}

export type PasswordError = InvalidEmptyPassword;

export class Password extends ValueObject<PasswordProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: PasswordProps) {
        super(props);
    }

    public static create(value: string): Either<PasswordError, Password> {
        if (!value) {
            return Either.left({ kind: "InvalidEmptyPassword" });
        } else {
            return Either.right(
                new Password({
                    value: value,
                })
            );
        }
    }
}
