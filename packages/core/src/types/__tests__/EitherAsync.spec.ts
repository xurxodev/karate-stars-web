import { Either } from "../Either";
import { EitherAsync } from "../EitherAsync";

describe("EitherAsync", () => {
    describe("from either", () => {
        it("should create EitherAsync from Either sucesss", async () => {
            const result = await EitherAsync.fromEither(createApiSuccess(5)).run();

            result.fold(
                () => fail("Result should be success"),
                value => expect(value).toEqual(5)
            );
        });

        it("should create EitherAsync from Either error", async () => {
            const result = await EitherAsync.fromEither(createApiFailure(404)).run();

            result.fold(
                error => expect((error as ApiFailure).statusCode).toEqual(404),
                _ => fail("Result should be error")
            );
        });
    });
    describe("from promise", () => {
        it("should create EitherAsync from Either sucesss", async () => {
            const result = await EitherAsync.fromPromise(createApiSuccessAsync(5)).run();

            result.fold(
                () => fail("Result should be success"),
                value => expect(value).toEqual(5)
            );
        });

        it("should create EitherAsync from Either error", async () => {
            const result = await EitherAsync.fromPromise(createApiFailureAsync(404)).run();

            result.fold(
                error => expect((error as ApiFailure).statusCode).toEqual(404),
                _ => fail("Result should be error")
            );
        });
    });
    describe("flatMap and map", () => {
        it("should chain with flapMap and extract the error from either with promises", async () => {
            const result = await EitherAsync.fromPromise(createApiSuccessAsync(5))
                .flatMap(() => createApiSuccessAsync(6))
                .flatMap(() => createApiFailureAsync(404))
                .run();

            result.fold(
                error => expect((error as ApiFailure).statusCode).toEqual(404),
                _ => fail("Result should be error")
            );
        });

        it("should chain with map and extract the success from either with promises", async () => {
            const result = await EitherAsync.fromPromise(createApiSuccessAsync(5))
                .map(value => value * 2)
                .run();

            result.fold(
                () => fail("Result should be success"),
                value => expect(value).toEqual(10)
            );
        });
    });
    describe("flatMapLeft and mapLeft", () => {
        it("should chain with flapMapLeft and extract the mapped error from either with promises", async () => {
            const result = await EitherAsync.fromPromise(createApiFailureAsync(404))
                .flatMapLeft(() => createApiFailureAsync(500))
                .run();

            result.fold(
                error => expect((error as ApiFailure).statusCode).toEqual(500),
                _ => fail("Result should be error")
            );
        });

        it("should chain with flapLeft and extract the mapped error from either with promises", async () => {
            const result = await EitherAsync.fromPromise(createApiFailureAsync(404))
                .mapLeft(() => ({ kind: "ApiFailure", statusCode: 500 }))
                .run();

            result.fold(
                error => expect((error as ApiFailure).statusCode).toEqual(500),
                _ => fail("Result should be error")
            );
        });
    });
});

export interface ApiFailure {
    kind: "ApiFailure";
    statusCode: number;
}

export interface UnexpectedFailure {
    kind: "UnexpectedFailure";
    error: Error;
}

export type ProcessFailure = ApiFailure | UnexpectedFailure;

function createApiFailureAsync(code: number): Promise<Either<ProcessFailure, number>> {
    return new Promise((resolve, _) =>
        setTimeout(() => {
            resolve(createApiFailure(code));
        }, 100)
    );
}

function createApiSuccessAsync(value: number): Promise<Either<ProcessFailure, number>> {
    return new Promise((resolve, _) =>
        setTimeout(() => {
            resolve(createApiSuccess(value));
        }, 100)
    );
}

function createApiFailure(code: number): Either<ProcessFailure, number> {
    return Either.left({ kind: "ApiFailure", statusCode: code });
}

function createApiSuccess(value: number): Either<ProcessFailure, number> {
    return Either.right(value);
}
