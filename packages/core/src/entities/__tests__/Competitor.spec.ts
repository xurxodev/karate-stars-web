import { Competitor, CompetitorData } from "../competitor";

const competitorRawData: CompetitorData = {
    id: "tjZtIOHwzVJ",
    firstName: "Rafael",
    lastName: "Aghayev",
    wkfId: "AZE133",
    biography:
        "Rafael Aghayev is the first karateka to be a 5-time individual world champion, a record he achieved at the World Championships in 2016 in Linz.\nRafael Agayev was born on March 4, 1985 in the city of Sumgait. He began to play football and study karate at the age of 7 with his first master Rafael Mamedov.\nIn 2007 Rafael graduated from the Azerbaijan State Academy of Physical Culture and Sports, Single combat sports Faculty, chair of “Fight and its methodology”, degree of coach and master in karate. From 2007 to 2008 Rafael passed military service in Agjabedi region of Azerbaijan Republic. After it he was transferred to the Central Sports Club of the Ministry of Defense. At the first national competitions, he was noticed and invited to train in one of the most famous sports clubs of the Republic.",
    countryId: "uIaQv0JlN5n",
    categoryId: "Gps5nVcCdjV",
    mainImage: "http://www.karatestarsapp.com/app/images/rafael_aghayev.jpg",
    isActive: true,
    isLegend: true,
    links: [
        { url: "http://aghayev.pro/", type: "web" },
        { url: "https://www.facebook.com/RafaelAghayevFanPage", type: "facebook" },
        { url: "https://www.instagram.com/aghayev_rafael", type: "instagram" },
        { url: "https://www.twitter.com/aghayev_rafael", type: "twitter" },
    ],
    achievements: [
        {
            eventId: "E9j3diJPYyL",
            categoryId: "sl51SV7E7UF",
            position: 1,
        },
        {
            eventId: "bCmarQfHGMq",
            categoryId: "sl51SV7E7UF",
            position: 1,
        },
    ],
};

describe("Competitor", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = Competitor.create(competitorRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should not return errors if all fields are valid but image", () => {
            const result = Competitor.create({ ...competitorRawData, mainImage: undefined });

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should not return errors if all fields are valid but links", () => {
            const result = Competitor.create({ ...competitorRawData, links: [] });

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Competitor.create({ ...competitorRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for first name", () => {
            const result = Competitor.create({ ...competitorRawData, firstName: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "firstName")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for last name", () => {
            const result = Competitor.create({ ...competitorRawData, lastName: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "lastName")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for wkfId", () => {
            const result = Competitor.create({ ...competitorRawData, wkfId: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "wkfId")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for biography", () => {
            const result = Competitor.create({ ...competitorRawData, biography: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "biography")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for countryId", () => {
            const result = Competitor.create({ ...competitorRawData, countryId: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "countryId")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for categoryId", () => {
            const result = Competitor.create({ ...competitorRawData, categoryId: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "categoryId")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid error for non valid main image", () => {
            const result = Competitor.create({ ...competitorRawData, mainImage: "wrong image" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "mainImage")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for one link", () => {
            const result = Competitor.create({
                ...competitorRawData,
                links: [{ type: "web", url: "wrong url" }],
            });

            result.fold(
                errors =>
                    expect(
                        errors.find(
                            error => error.property === "url" && error.type === "SocialLink"
                        )?.errors[0]
                    ).toBe("invalid_field"),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for two links", () => {
            const result = Competitor.create({
                ...competitorRawData,
                links: [
                    { type: "web", url: "wrong url" },
                    { type: "twitter", url: "wrong url" },
                ],
            });

            result.fold(
                errors => {
                    const linkErrors = errors.filter(
                        error => error.property === "url" && error.type === "SocialLink"
                    );
                    expect(linkErrors[0].errors[0]).toBe("invalid_field");
                    expect(linkErrors[1].errors[0]).toBe("invalid_field");
                },
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for achievements", () => {
            const result = Competitor.create({ ...competitorRawData, achievements: [] });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "achievements")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid field error for all achievements for categoryId", () => {
            const result = Competitor.create({
                ...competitorRawData,
                achievements: competitorRawData.achievements.map(achievement => ({
                    ...achievement,
                    categoryId: "wrong id",
                })),
            });

            result.fold(
                errors => {
                    const linkErrors = errors.filter(
                        error => error.property === "categoryId" && error.type === "Achievement"
                    );
                    expect(linkErrors[0].errors[0]).toBe("invalid_field");
                    expect(linkErrors[1].errors[0]).toBe("invalid_field");
                },
                () => fail("should be error")
            );
        });
        it("should return invalid field error for all achievements for eventId", () => {
            const result = Competitor.create({
                ...competitorRawData,
                achievements: competitorRawData.achievements.map(achievement => ({
                    ...achievement,
                    eventId: "wrong id",
                })),
            });

            result.fold(
                errors => {
                    const linkErrors = errors.filter(
                        error => error.property === "eventId" && error.type === "Achievement"
                    );
                    expect(linkErrors[0].errors[0]).toBe("invalid_field");
                    expect(linkErrors[1].errors[0]).toBe("invalid_field");
                },
                () => fail("should be error")
            );
        });
        it("should return invalid field error for all achievements for position", () => {
            const result = Competitor.create({
                ...competitorRawData,
                achievements: competitorRawData.achievements.map(achievement => ({
                    ...achievement,
                    position: -1,
                })),
            });

            result.fold(
                errors => {
                    const linkErrors = errors.filter(
                        error => error.property === "position" && error.type === "Achievement"
                    );
                    expect(linkErrors[0].errors[0]).toBe("field_number_must_be_greater_than_0");
                    expect(linkErrors[1].errors[0]).toBe("field_number_must_be_greater_than_0");
                },
                () => fail("should be error")
            );
        });
    });
});
