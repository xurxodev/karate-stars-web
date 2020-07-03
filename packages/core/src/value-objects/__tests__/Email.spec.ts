import { Email } from "../Email";

describe("Id", () => {
    it("should return success reponse if email is valid", () => {
        const emailValue = "info@karatestarsapp.com";
        const emailResult = Email.create(emailValue);

        emailResult.fold(
            error => fail(error),
            email => expect(email.value).toEqual(emailValue)
        );
    });
    it("should return InvalidEmptyEmail error if value argument is empty", () => {
        const id = Email.create("");

        id.fold(
            error => expect(error.kind).toBe("InvalidEmptyEmail"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument is invalid", () => {
        const id = Email.create("infokaratestarsapp.com");

        id.fold(
            error => expect(error.kind).toBe("InvalidEmail"),
            () => fail("should be fail")
        );
    });
});
