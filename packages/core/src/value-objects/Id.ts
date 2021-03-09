import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";
import { validateRegexp, validateRequired } from "../utils/validations";
import { ValidationErrorKey } from "../types/Errors";

export interface IdProps {
    value: string;
}

const abc = "abcdefghijklmnopqrstuvwxyz";
const letters = abc.concat(abc.toUpperCase());

const ALLOWED_CHARS = `0123456789${letters}`;

const NUMBER_OF_CODEPOINTS = ALLOWED_CHARS.length;
const CODESIZE = 11;

/**
 * JkWynlWMjJR' // valid
 * 0kWynlWMjJR' // invalid (Uid can not start with a number)
 * AkWy$lWMjJR  // invalid (Uid can only contain alphanumeric characters.
 */
const ID_PATTERN = /^[a-zA-Z]{1}[a-zA-Z0-9]{10}$/;

export class Id extends ValueObject<IdProps> {
    get value(): string {
        return this.props.value;
    }

    private constructor(props: IdProps) {
        super(props);
    }

    /**
     * Generate a valid Karate Stars id. A valid Karate Stars id is a 11 character string which starts with a letter from the ISO basic Latin alphabet.
     * @return {string} A 11 character uid that always starts with a letter.
     * generateUid();
     */
    public static generateId(): Id {
        // First char should be a letter
        let randomChars = letters.charAt(randomWithMax(letters.length));

        for (let i = 1; i < CODESIZE; i += 1) {
            randomChars += ALLOWED_CHARS.charAt(randomWithMax(NUMBER_OF_CODEPOINTS));
        }

        return new Id({ value: randomChars });
    }

    public static createExisted(id: string): Either<ValidationErrorKey[], Id> {
        const requiredError = validateRequired(id);
        const regexpErrors = validateRegexp(id, ID_PATTERN);

        if (requiredError.length > 0) {
            return Either.left(requiredError);
        } else if (regexpErrors.length > 0) {
            return Either.left(regexpErrors);
        } else {
            return Either.right(new Id({ value: id }));
        }
    }
}

function randomWithMax(max: number) {
    return Math.floor(Math.random() * max);
}
