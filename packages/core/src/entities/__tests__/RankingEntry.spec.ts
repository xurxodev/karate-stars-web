import { RankingEntry } from "../ranking/RankingEntry";

const rankingEntryData = {
    id: "Le4ZfPnOuz3",
    rankingId: "vnsabLUirBx",
    rank: 1,
    country: "AZERBAIJAN",
    countryCode: "AZE",
    name: "EMILIYA MITLINOVA",
    firstName: "EMILIYA",
    lastName: "MITLINOVA",
    wkfId: "AZE02537",
    photo: "https://www.sportdata.org/wkf/competitor_pics/47916.jpg",
    totalPoints: 1590,
    continentalCode: "EKF",
    categoryId: "X4CZx1DLFPc",
    categoryWkfId: "705",
};

describe("RankingEntry", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = RankingEntry.create(rankingEntryData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = RankingEntry.create({ ...rankingEntryData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for rankingId", () => {
            const result = RankingEntry.create({ ...rankingEntryData, rankingId: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "rankingId")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for categoryId", () => {
            const result = RankingEntry.create({ ...rankingEntryData, categoryId: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "categoryId")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for country", () => {
            const result = RankingEntry.create({ ...rankingEntryData, country: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "country")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for countryCode", () => {
            const result = RankingEntry.create({ ...rankingEntryData, countryCode: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "countryCode")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = RankingEntry.create({ ...rankingEntryData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for firstName", () => {
            const result = RankingEntry.create({ ...rankingEntryData, firstName: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "firstName")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for lastName", () => {
            const result = RankingEntry.create({ ...rankingEntryData, lastName: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "lastName")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for wkfId", () => {
            const result = RankingEntry.create({ ...rankingEntryData, wkfId: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "wkfId")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for continentalCode", () => {
            const result = RankingEntry.create({ ...rankingEntryData, continentalCode: "" });

            result.fold(
                errors =>
                    expect(
                        errors.find(error => error.property === "continentalCode")?.errors[0]
                    ).toBe("field_cannot_be_blank"),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for categoryWkfId", () => {
            const result = RankingEntry.create({ ...rankingEntryData, categoryWkfId: "" });

            result.fold(
                errors =>
                    expect(
                        errors.find(error => error.property === "categoryWkfId")?.errors[0]
                    ).toBe("field_cannot_be_blank"),
                () => fail("should be error")
            );
        });
    });
});
