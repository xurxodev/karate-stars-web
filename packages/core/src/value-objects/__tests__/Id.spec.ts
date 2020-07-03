import { Id } from "../Id";

describe("Id", () => {
    it("should generate a valid id", () => {
        const id = Id.generateId();

        expect(Id.isValid(id.value)).toBeTruthy();
    });
    it("should return success creating from a valid existed id", () => {
        const existedId = Id.generateId().value;

        const idResult = Id.createExisted(existedId);

        idResult.fold(
            error => fail(error),
            id => expect(id.value).toEqual(existedId)
        );
    });
    it("should return InvalidEmptyId error if value argument is empty", () => {
        const idResult = Id.createExisted("");

        idResult.fold(
            error => expect(error.kind).toBe("InvalidEmptyId"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument is invalid", () => {
        const idResult = Id.createExisted("invalid");

        idResult.fold(
            error => expect(error.kind).toBe("InvalidId"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument starts with a number", () => {
        const idResult = Id.createExisted("0kWynlWMjJR");

        idResult.fold(
            error => expect(error.kind).toBe("InvalidId"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument constains non-alphanumeric characters", () => {
        const idResult = Id.createExisted("AkWy$lWMjJR");

        idResult.fold(
            error => expect(error.kind).toBe("InvalidId"),
            () => fail("should be fail")
        );
    });
});
