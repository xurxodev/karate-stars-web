import { ValueObject } from "./ValueObject";
import { Either } from "../types/Either";

export interface InvalidId {
    kind: "InvalidId";
}

export interface InvalidEmptyId {
    kind: "InvalidEmptyId";
}

export type IdError = InvalidId | InvalidEmptyId;

export interface IdProps {
    value: string;
}

const abc = "abcdefghijklmnopqrstuvwxyz";
const letters = abc.concat(abc.toUpperCase());

const ALLOWED_CHARS = `0123456789${letters}`;

const NUMBER_OF_CODEPOINTS = ALLOWED_CHARS.length;
const CODESIZE = 11;

const CODE_PATTERN = /^[a-zA-Z]{1}[a-zA-Z0-9]{10}$/;

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

    public static createExisted(id: string): Either<IdError, Id> {
        if (!id) {
            return Either.left({ kind: "InvalidEmptyId" });
        } else if (!this.isValid(id)) {
            return Either.left({ kind: "InvalidId" });
        } else {
            return Either.right(new Id({ value: id }));
        }
    }

    /**
     * Tests whether the given code is valid.
     *
     * @param {string} code The code to validate.
     * @return {boolean} Returns true if the code is valid, false otherwise.
     *
     * isValidUid('JkWynlWMjJR'); // true
     * isValidUid('0kWynlWMjJR'); // false (Uid can not start with a number)
     * isValidUid('AkWy$lWMjJR'); // false (Uid can only contain alphanumeric characters.
     */
    public static isValid(id: string): boolean {
        if (id === null) {
            return false;
        }

        return CODE_PATTERN.test(id);
    }
}

function randomWithMax(max: number) {
    return Math.floor(Math.random() * max);
}
