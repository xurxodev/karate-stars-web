import { Video, VideoData } from "../video";

const videoRawData: VideoData = {
    id: "tjZtIOHwzVJ",
    links: [
        {
            id: "o4guDvlaxMQ",
            type: "youtube",
        },
        {
            id: "101010101010",
            type: "facebook",
        },
    ],
    title: "Karate1 Premier League Paris 2019",
    description: "Kumite -75 KG Round 4",
    subtitle: "Y. Sakiyama (JPN) - R. Aghayev (AZE)",
    competitors: ["tjZtIOHwzVJ"],
    eventDate: new Date(),
    createdDate: new Date(),
    order: 4,
};

describe("Competitor", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = Video.create(videoRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = Video.create({ ...videoRawData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id")?.errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for links", () => {
            const result = Video.create({ ...videoRawData, links: [] });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "links")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for title", () => {
            const result = Video.create({ ...videoRawData, title: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "title")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for subtitle", () => {
            const result = Video.create({ ...videoRawData, subtitle: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "subtitle")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for description", () => {
            const result = Video.create({ ...videoRawData, description: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "description")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for competitors", () => {
            const result = Video.create({ ...videoRawData, competitors: [] });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "competitors")?.errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for all social links for id", () => {
            const result = Video.create({
                ...videoRawData,
                links: videoRawData.links.map(link => ({
                    ...link,
                    id: "",
                })),
            });

            result.fold(
                errors => {
                    const linkErrors = errors.filter(
                        error => error.property === "id" && error.type === "VideoLink"
                    );
                    expect(linkErrors[0].errors[0]).toBe("field_cannot_be_blank");
                    expect(linkErrors[1].errors[0]).toBe("field_cannot_be_blank");
                },
                () => fail("should be error")
            );
        });
        it("should return invalid field error for all competitors for id", () => {
            const result = Video.create({
                ...videoRawData,
                competitors: ["wrong_id1", "wrong_id2"],
            });

            result.fold(
                errors => {
                    const competitorErrors = errors.filter(
                        error => error.property === "competitors" && error.type === "Video"
                    );
                    expect(competitorErrors[0].errors[0]).toBe("invalid_field");
                    expect(competitorErrors[1].errors[0]).toBe("invalid_field");
                },
                () => fail("should be error")
            );
        });
    });
});
