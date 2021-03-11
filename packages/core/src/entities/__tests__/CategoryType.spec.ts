import { CategoryType } from "../CategoryType";

const categoryTypeRawData = {
    id: "qWPs4i1e78g",
    name: "Kata",
};

describe("CategoryType", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = CategoryType.create(categoryTypeRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = CategoryType.create({ ...categoryTypeRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = CategoryType.create({ ...categoryTypeRawData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
    });
});
