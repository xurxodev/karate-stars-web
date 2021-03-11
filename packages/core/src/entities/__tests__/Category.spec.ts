import { Category } from "../Category";

const categoryRawData = {
    id: "CYrgQdA0ZZm",
    name: "Female Kumite Open",
    typeId: "Gps5nVcCdjV",
};

describe("Category", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = Category.create(categoryRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Category.create({ ...categoryRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = Category.create({ ...categoryRawData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for typeId", () => {
            const result = Category.create({ ...categoryRawData, typeId: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "typeId")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
    });
});
