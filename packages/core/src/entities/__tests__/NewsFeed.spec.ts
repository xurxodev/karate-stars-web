import { NewsFeed, RssType } from "../NewsFeed";

const NewsFeedData = {
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
            const result = NewsFeed.create(NewsFeedData);

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should not return errors if all fields are valid but image", () => {
            const result = NewsFeed.create({ ...NewsFeedData, image: "" });

            result.fold(
                () => fail("should be success"),
                feed => expect(feed).toBeTruthy()
            );
        });
        it("should return invalid field error for id", () => {
            const result = NewsFeed.create({ ...NewsFeedData, id: "wrong_id" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "id").errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for name", () => {
            const result = NewsFeed.create({ ...NewsFeedData, name: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "name").errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for language", () => {
            const result = NewsFeed.create({ ...NewsFeedData, language: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "language").errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return cannot be blank error for url", () => {
            const result = NewsFeed.create({ ...NewsFeedData, url: "" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "url").errors[0]).toBe(
                        "field_cannot_be_blank"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid error for non valid image", () => {
            const result = NewsFeed.create({ ...NewsFeedData, image: "wrong image" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "image").errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
        it("should return invalid error for non valid url", () => {
            const result = NewsFeed.create({ ...NewsFeedData, url: "wrong url" });

            result.fold(
                errors =>
                    expect(errors.find(error => error.property === "url").errors[0]).toBe(
                        "invalid_field"
                    ),
                () => fail("should be error")
            );
        });
    });
});
