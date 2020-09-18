import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { ValidationErrors } from "../types/Errors";
import { validateRequired, validateRegexp } from "../utils/validations";

export interface UrlProps {
    value: string;
}

const URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export class Url extends ValueObject<UrlProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UrlProps) {
        super(props);
    }

    public static create(url: string): Either<ValidationErrors, Url> {
        const requiredError = validateRequired(url);
        const regexpErrors = validateRegexp(url, URL_PATTERN);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else if (regexpErrors.length > 0) {
            return Either.left(regexpErrors);
        } else {
            return Either.right(new Url({ value: url }));
        }
    }
}
