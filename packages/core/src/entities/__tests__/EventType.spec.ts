import { EventType } from "../EventType";

const eventTypeRawData = {
    id: "P6pP1rTDNx2",
    name: "World Championships",
};

describe("NewsFeed", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = EventType.create(eventTypeRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = EventType.create({ ...eventTypeRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = EventType.create({ ...eventTypeRawData, name: "" });

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
