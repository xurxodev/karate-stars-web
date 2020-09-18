import { Id } from "../Id";

describe("Id", () => {
    it("should return success creating from a valid existed id", () => {
        const existedId = Id.generateId().value;

        const idResult = Id.createExisted(existedId);

        idResult.fold(
            error => fail(error),
            id => expect(id.value).toEqual(existedId)
        );
    });
    it("should return Id cannot be blank error if value argument is empty", () => {
        const idResult = Id.createExisted("");

        idResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toBe("field_cannot_be_blank");
            },
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument is invalid", () => {
        const idResult = Id.createExisted("wrong id");

        idResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toBe("invalid_field");
            },
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument starts with a number", () => {
        const idResult = Id.createExisted("0kWynlWMjJR");

        idResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toBe("invalid_field");
            },
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument constains non-alphanumeric characters", () => {
        const idResult = Id.createExisted("AkWy$lWMjJR");

        idResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toBe("invalid_field");
            },
            () => fail("should be fail")
        );
    });
});
