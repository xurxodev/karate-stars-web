import { ValueObject } from "../ValueObject";
import { Either } from "../Either";

export interface InvalidUrl {
    kind: "InvalidUrl";
}

export interface InvalidEmptyUrl {
    kind: "InvalidEmptyUrl";
}

export type UrlError = InvalidUrl | InvalidEmptyUrl

export interface UrlProps {
    value: string;
}

export class Url extends ValueObject<UrlProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: UrlProps) {
        super(props);
    }

    public static create(url: string): Either<UrlError, Url> {
        if (!url) {
            return Either.left({ kind: "InvalidEmptyUrl" })
        } else if (!this.isValidUrl(url)) {
            return Either.left({ kind: "InvalidUrl" })
        } else {
            return Either.right(new Url({ value: url }));
        }
    }

    private static isValidUrl(email: string) {
        var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
        return re.test(email);
    }
}