import { Maybe } from "../Maybe";
import { MaybeAsync } from "../MaybeAsync";

describe("MaybeAsync", () => {
    describe("from Maybe", () => {
        it("should create MaybeAsync from Maybe some", async () => {
            const result = await MaybeAsync.fromMaybe(Maybe.some(5)).run();

            result.fold(
                () => fail("Result should be some"),
                value => expect(value).toEqual(5)
            );
        });

        it("should create MaybeAsync from Maybe none", async () => {
            const result = await MaybeAsync.fromMaybe(Maybe.none()).run();

            result.fold(
                () => expect(result.isEmpty()).toBeTruthy(),
                () => fail("Result should be none")
            );
        });
    });
    describe("from promise", () => {
        it("should create MaybeAsync from promise of  Maybe some", async () => {
            const result = await MaybeAsync.fromPromise(createSomeAsync(5)).run();

            result.fold(
                () => fail("Result should be some"),
                value => expect(value).toEqual(5)
            );
        });

        it("should create MaybeAsync from promise of Maybe none", async () => {
            const result = await MaybeAsync.fromPromise(createNoneAsync()).run();

            result.fold(
                () => expect(result.isEmpty()).toBeTruthy(),
                () => fail("Result should be none")
            );
        });
    });
    describe("flatMap and map", () => {
        it("should chain with flapMap and extract the none from maybe with promises", async () => {
            const result = await MaybeAsync.fromPromise(createSomeAsync(5))
                .flatMap(() => createSomeAsync(6))
                .flatMap(() => createNoneAsync())
                .run();

            result.fold(
                () => expect(result.isEmpty()).toBeTruthy(),
                () => fail("Result should be none")
            );
        });

        it("should chain with map and extract the some from maybe with promises", async () => {
            const result = await MaybeAsync.fromPromise(createSomeAsync(5))
                .map(value => value * 2)
                .run();

            result.fold(
                () => fail("Result should be some"),
                value => expect(value).toEqual(10)
            );
        });
    });
    describe("toEither", () => {
        it("should return error either from none maybe", async () => {
            const result = await MaybeAsync.fromPromise(createNoneAsync()).toEither({
                kind: "ApiFailure",
                statusCode: 404,
            });

            result.fold(
                error => expect((error as ApiFailure).statusCode).toEqual(404),
                _ => fail("Result should be none")
            );
        });

        it("should chain with flapLeft and extract the mapped error from either with promises", async () => {
            const result = await MaybeAsync.fromPromise(createSomeAsync(5)).toEither({
                kind: "ApiFailure",
                statusCode: 404,
            });

            result.fold(
                () => fail("Result should be some"),
                value => expect(value).toEqual(5)
            );
        });
    });
});

export interface ApiFailure {
    kind: "ApiFailure";
    statusCode: number;
}

function createNoneAsync(): Promise<Maybe<number>> {
    return new Promise((resolve, _) =>
        setTimeout(() => {
            resolve(Maybe.none());
        }, 100)
    );
}

function createSomeAsync(value: number): Promise<Maybe<number>> {
    return new Promise((resolve, _) =>
        setTimeout(() => {
            resolve(Maybe.some(value));
        }, 100)
    );
}
