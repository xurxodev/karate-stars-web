import { Id } from "../Id";

describe("Id", () => {
    it("should generate a valid id", () => {
        const id = Id.generateId();

        expect(Id.isValid(id.value)).toBeTruthy();
    });
    it("should return right creating from a valid existed id", () => {
        const existedId = Id.generateId().value;

        const id = Id.createExisted(existedId);

        id.fold(
            error => fail(error),
            id => expect(id.value).toEqual(existedId)
        );
    });
    it("should return InvalidEmptyId error if argument id is empty", () => {
        const id = Id.createExisted("");

        id.fold(
            error => expect(error.kind).toBe("InvalidEmptyId"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if argument id is invalid", () => {
        const id = Id.createExisted("invalid");

        id.fold(
            error => expect(error.kind).toBe("InvalidId"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if argument id starts with a number", () => {
        const id = Id.createExisted("0kWynlWMjJR");

        id.fold(
            error => expect(error.kind).toBe("InvalidId"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if argument id starts constains non-alphanumeric characters", () => {
        const id = Id.createExisted("AkWy$lWMjJR");

        id.fold(
            error => expect(error.kind).toBe("InvalidId"),
            () => fail("should be fail")
        );
    });
});
