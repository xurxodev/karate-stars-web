import { Event } from "../Event";

const EventRawData = {
    id: "CYrgQdA0ZZm",
    name: "World Championships Maastricht 1984",
    year: 1984,
    typeId: "Jr6N73CZWtE",
};

describe("Event", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = Event.create(EventRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Event.create({ ...EventRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = Event.create({ ...EventRawData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for typeId", () => {
            const result = Event.create({ ...EventRawData, typeId: "wrong_id" });

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
