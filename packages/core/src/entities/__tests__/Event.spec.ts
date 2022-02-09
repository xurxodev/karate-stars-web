import { Event } from "../Event";

const eventRawData = {
    id: "CYrgQdA0ZZm",
    name: "World Championships Maastricht 1984",
    typeId: "Jr6N73CZWtE",
    startDate: new Date(1984, 11, 21),
    endDate: new Date(1984, 11, 25),
    url: "https://en.wikipedia.org/wiki/1984_World_Karate_Championships",
};

describe("Event", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = Event.create(eventRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Event.create({ ...eventRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = Event.create({ ...eventRawData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for url", () => {
            const result = Event.create({ ...eventRawData, url: "wrong_url" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "url")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for typeId", () => {
            const result = Event.create({ ...eventRawData, typeId: "wrong_id" });

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
