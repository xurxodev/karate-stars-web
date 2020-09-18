import { Password } from "../Password";

describe("Password", () => {
    it("should return success reponse if value argument is valid", () => {
        const passwordValue = "info@karatestarsapp.com";
        const passwordResult = Password.create(passwordValue);

        passwordResult.fold(
            error => fail(error),
            email => expect(email.value).toEqual(passwordValue)
        );
    });
    it("should return InvalidEmptyPassword error if value argument is empty", () => {
        const passwordResult = Password.create("");

        passwordResult.fold(
            errors => {
                expect(errors.length).toBe(1);
                expect(errors[0]).toBe("field_cannot_be_blank");
            },
            () => fail("should be fail")
        );
    });
});
