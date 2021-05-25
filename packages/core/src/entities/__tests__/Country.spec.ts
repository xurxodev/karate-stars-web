import { Country } from "../Country";

const CountryRawData = {
    id: "P6pP1rTDNx2",
    name: "Spain",
    iso2: "es",
    image: "http://www.karatestarsapp.com/app/flags/es.png",
};

describe("Country", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = Country.create(CountryRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should not return errors if all fields are valid but image", () => {
            const result = Country.create({ ...CountryRawData, image: "" });

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Country.create({ ...CountryRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = Country.create({ ...CountryRawData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for iso2", () => {
            const result = Country.create({ ...CountryRawData, iso2: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "iso2")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid error for non valid image", () => {
            const result = Country.create({ ...CountryRawData, image: "wrong image" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "image").errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
    });
});
