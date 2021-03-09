import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { ValidationErrorKey } from "../types/Errors";
import { validateRequired } from "../utils/validations";

export interface PasswordProps {
    value: string;
}

export class Password extends ValueObject<PasswordProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: PasswordProps) {
        super(props);
    }

    public static create(password: string): Either<ValidationErrorKey[], Password> {
        const requiredError = validateRequired(password);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else {
            return Either.right(new Password({ value: password }));
        }
    }
}
