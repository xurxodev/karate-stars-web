import { Email } from "../Email";

describe("Email", () => {
    it("should return success reponse if email is valid", () => {
        const emailValue = "info@karatestarsapp.com";
        const emailResult = Email.create(emailValue);

        emailResult.fold(
            error => fail(error),
            email => expect(email.value).toEqual(emailValue)
        );
    });
    it("should return InvalidEmptyEmail error if value argument is empty", () => {
        const emailResult = Email.create("");

        emailResult.fold(
            error => expect(error.kind).toBe("InvalidEmptyEmail"),
            () => fail("should be fail")
        );
    });
    it("should return InvalidId error if value argument is invalid", () => {
        const emailResult = Email.create("infokaratestarsapp.com");

        emailResult.fold(
            error => expect(error.kind).toBe("InvalidEmail"),
            () => fail("should be fail")
        );
    });
});
