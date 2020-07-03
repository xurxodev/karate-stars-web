import { Url } from "../Url";

describe("Url", () => {
    it("should return success reponse if url argument is valid", () => {
        const urlvalue = "http://karatestarsapp.com";
        const urlResult = Url.create(urlvalue);

        urlResult.fold(
            error => fail(error),
            email => expect(email.value).toEqual(urlvalue)
        );
    });
    it("should return InvalidEmptyUrl error if value argument is empty", () => {
        const urlResult = Url.create("");

        urlResult.fold(
            error => expect(error.kind).toBe("InvalidEmptyUrl"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidUrl error if value argument is invalid", () => {
        const urlResult = Url.create("hp://karatestarsapp.com");

        urlResult.fold(
            error => expect(error.kind).toBe("InvalidUrl"),
            () => fail("should be fail")
        );
    });
});
