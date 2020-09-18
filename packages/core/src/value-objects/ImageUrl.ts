import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { ValidationErrors } from "../types/Errors";
import { validateRequired, validateRegexp } from "../utils/validations";

export interface UrlProps {
    value: string;
}

const URL_PATTERN = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png)/;

export class ImageUrl extends ValueObject<UrlProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: UrlProps) {
        super(props);
    }

    public static create(url: string): Either<ValidationErrors, ImageUrl> {
        const requiredError = validateRequired(url);
        const regexpErrors = validateRegexp(url, URL_PATTERN);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else if (regexpErrors.length > 0) {
            return Either.left(regexpErrors);
        } else {
            return Either.right(new ImageUrl({ value: url }));
        }
    }
}
