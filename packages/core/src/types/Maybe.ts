export class Maybe<T> {
    private constructor(private value: T | null) {}

    static some<T>(value: T) {
        if (!value) {
            throw Error("Provided value must not be empty");
        }
        return new Maybe(value);
    }

    isDefined(): boolean {
        return this.value !== null;
    }

    isEmpty(): boolean {
        return this.value === null;
    }

    static none<T>() {
        return new Maybe<T>(null);
    }

    static fromValue<T>(value: T | undefined) {
        return value ? Maybe.some(value) : Maybe.none<T>();
    }

    get(): T {
        return this.getOrThrow();
    }

    getOrElse(defaultValue: T) {
        return this.value === null ? defaultValue : this.value;
    }

    map<R>(f: (wrapped: T) => R): Maybe<R> {
        if (this.value === null) {
            return Maybe.none<R>();
        } else {
            return Maybe.fromValue(f(this.value));
        }
    }

    getOrThrow(errorMessage?: string): T {
        if (!this.value) {
            throw Error(errorMessage ? errorMessage : "Value is empty");
        }

        return this.value;
    }
}
