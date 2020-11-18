import { Either } from "./Either";
import { Maybe } from "./Maybe";

export class MaybeAsync<Data> {
    private constructor(private readonly promiseValue: () => Promise<Maybe<Data>>) {}

    map<T>(fn: (value: Data) => T): MaybeAsync<T> {
        return this.flatMap(async some => Maybe.fromValue(fn(some)));
    }

    flatMap<T>(fn: (value: Data) => Promise<Maybe<T>>): MaybeAsync<T> {
        return new MaybeAsync<T>(async () => {
            const value = await this.promiseValue();

            return value.fold(
                async () => Maybe.none<T>(),
                some => fn(some)
            );
        });
    }

    run(): Promise<Maybe<Data>> {
        return this.promiseValue();
    }

    async toEither<L>(leftValue: L): Promise<Either<L, Data>> {
        const maybe = await this.promiseValue();

        return maybe.fold(
            () => Either.left(leftValue),
            someValue => Either.right(someValue)
        );
    }

    static fromMaybe<Data>(maybe: Maybe<Data>): MaybeAsync<Data> {
        return new MaybeAsync<Data>(() => Promise.resolve(maybe));
    }

    static fromPromise<Data>(value: Promise<Maybe<Data>>): MaybeAsync<Data> {
        return new MaybeAsync<Data>(() => value);
    }
}
