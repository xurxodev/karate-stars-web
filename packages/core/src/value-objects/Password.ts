import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { ValidationErrors } from "../types/Errors";
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

    public static create(password: string): Either<ValidationErrors, Password> {
        const requiredError = validateRequired(password, Password.name);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else {
            return Either.right(new Password({ value: password }));
        }
    }
}
