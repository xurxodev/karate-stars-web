import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { ValidationErrorKey } from "../types/Errors";
import { validateRequired, validateRegexp } from "../utils/validations";

export interface UrlProps {
    value: string;
    isDataUrl: boolean;
}

const URL_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,7}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const DATA_URL_PATTERN = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

export class Url extends ValueObject<UrlProps> {
    get value(): string {
        return this.props.value;
    }

    get isDataUrl(): boolean {
        return this.props.isDataUrl;
    }

    private constructor(props: UrlProps) {
        super(props);
    }

    public static create(
        url: string,
        dataUrlIsSupported = true
    ): Either<ValidationErrorKey[], Url> {
        const requiredError = validateRequired(url);
        const regexpURLErrors = validateRegexp(url, URL_PATTERN);
        const regexpDataURLErrors = validateRegexp(url, DATA_URL_PATTERN);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else if (
            regexpURLErrors.length > 0 &&
            (regexpDataURLErrors.length > 0 || !dataUrlIsSupported)
        ) {
            return Either.left(regexpURLErrors);
        } else {
            return Either.right(
                new Url({ value: url, isDataUrl: regexpDataURLErrors.length === 0 })
            );
        }
    }
}
