import { Either } from "../../../build";

describe("Maybe", () => {
    it("should return success for a valid value", () => {
        const result = Either.right(5);

        result.fold(
            error => fail(error),
            value => expect(value).toEqual(5)
        );
    });
    it("should return fail for a left value", () => {
        const result = Either.left({ kind: "error" });

        result.fold(
            error => expect(error.kind).toEqual("error"),
            () => fail("should be error")
        );
    });
    it("should return success mapped value for a initial valid value", () => {
        const result = Either.right(5);
        const mappedResult = result.map(value => value * 2);

        mappedResult.fold(
            error => fail(error),
            value => expect(value).toEqual(10)
        );
    });
    it("should return fail mapped value for a left initial value", () => {
        const result = Either.left({ kind: "error" });
        const mappedResult = result.map(value => value * 2);

        mappedResult.fold(
            error => expect(error.kind).toEqual("error"),
            () => fail("should be error")
        );
    });
    it("should return success mapped value after flatmap for a initial valid value", () => {
        const result = Either.right(5);
        const mappedResult = result.flatMap(value => Either.right(value * 2));

        mappedResult.fold(
            error => fail(error),
            value => expect(value).toEqual(10)
        );
    });
    it("should return first error after flatmap for a left initial value", () => {
        const result = Either.left({ kind: "error" });
        const mappedResult = result.flatMap(value => Either.right(value * 2));

        console.log({ mappedResult });

        mappedResult.fold(
            error => expect(error.kind).toEqual("error"),
            () => fail("should be error")
        );
    });
});
