import { NewsFeed, RssType } from "../NewsFeed";

const newsFeedRawData = {
    id: "P6pP1rTDNx2",
    name: "Karate-K",
    language: "en",
    type: "rss" as RssType,
    image: "https://karatestarsapp.com/app/logos/karate_k.png",
    url: "http://karate-k.com/en/?format=feed&type=rss",
};

describe("NewsFeed", () => {
    describe("create validations", () => {
        it("should not return errors if all fields are valid", () => {
            const result = NewsFeed.create(newsFeedRawData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should not return errors if all fields are valid but image", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, image: "" });

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, id: "wrong_id" });

            result.fold(
                errors => expect(errors["id"]).toEqual(["invalid_field"]),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, name: "" });

            result.fold(
                errors => expect(errors["name"]).toEqual(["field_cannot_be_blank"]),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for language", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, language: "" });

            result.fold(
                errors => expect(errors["language"]).toEqual(["field_cannot_be_blank"]),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for url", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, url: "" });

            result.fold(
                errors => expect(errors["url"]).toEqual(["field_cannot_be_blank"]),
                () => fail("should be error")
            );
        });
        it("should return invalid error for non valid image", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, image: "wrong image" });

            result.fold(
                errors => expect(errors["image"]).toEqual(["invalid_field"]),
                () => fail("should be error")
            );
        });
        it("should return invalid error for non valid url", () => {
            const result = NewsFeed.create({ ...newsFeedRawData, url: "wrong url" });

            result.fold(
                errors => expect(errors["url"]).toEqual(["invalid_field"]),
                () => fail("should be error")
            );
        });
    });
});
