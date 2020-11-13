import { Either } from "./Either";

type None = { kind: "none" };
type Some<Data> = { kind: "some"; someValue: Data };

type MaybeValue<Data> = None | Some<Data>;

export class Maybe<Data> {
    private constructor(private readonly value: MaybeValue<Data>) {}

    isDefined(): boolean {
        return this.value.kind === "some";
    }

    isEmpty(): boolean {
        return this.value.kind === "none";
    }

    fold<T>(noneFn: () => T, someFn: (someValue: Data) => T): T {
        switch (this.value.kind) {
            case "none":
                return noneFn();
            case "some":
                return someFn(this.value.someValue);
        }
    }

    get(): Data {
        return this.getOrThrow();
    }

    getOrElse(defaultValue: Data): Data {
        return this.fold(
            () => defaultValue,
            someValue => someValue
        );
    }

    flatMap<T>(f: (wrapped: Data) => Maybe<T>): Maybe<T> {
        return this.fold(
            () => Maybe.none(),
            someValue => f(someValue)
        );
    }

    toEither<L>(leftValue: L): Either<L, Data> {
        return this.fold(
            () => Either.left(leftValue),
            someValue => Either.right(someValue)
        );
    }

    map<T>(f: (wrapped: Data) => T): Maybe<T> {
        return this.flatMap(data => Maybe.fromValue(f(data)));
    }

    getOrThrow(errorMessage?: string): Data {
        const throwFn = () => {
            throw Error(errorMessage ? errorMessage : "Value is empty");
        };

        return this.fold(
            () => throwFn(),
            someValue => someValue
        );
    }

    static some<Data>(value: Data): Maybe<Data> {
        if (!value) {
            throw Error("Provided value must not be empty");
        }
        return new Maybe({ kind: "some", someValue: value });
    }

    static none<Data>(): Maybe<Data> {
        return new Maybe({ kind: "none" });
    }

    static fromValue<Data>(value: Data | undefined | null): Maybe<Data> {
        return !value ? Maybe.none() : Maybe.some(value);
    }
}
