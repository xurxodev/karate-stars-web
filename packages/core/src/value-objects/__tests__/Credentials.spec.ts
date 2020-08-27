import { Credentials } from "../Credentials";

const validEmailInput = "info@karatestarsapp.com";
const validPasswordInput = "39893898";
const invalidEmailInput = "infokaratestarsapp.com";

describe("Credentials", () => {
    it("should return success reponse if email and password are valid", () => {
        const result = Credentials.create({ email: validEmailInput, password: validPasswordInput });

        result.fold(
            error => fail(error),
            credentials => {
                expect(credentials.email.value).toEqual(validEmailInput);
                expect(credentials.password.value).toEqual(validPasswordInput);
            }
        );
    });
    it("should return Email cannot be blan error if email is empty", () => {
        const result = Credentials.create({ email: "", password: validPasswordInput });

        result.fold(
            errors => {
                expect(errors["email"][0]).toBe("Email cannot be blank");
            },
            () => fail("should be fail")
        );
    });

    it("should return Email cannot be blan error if email is empty", () => {
        const result = Credentials.create({ email: validEmailInput, password: "" });

        result.fold(
            errors => {
                expect(errors["password"][0]).toBe("Password cannot be blank");
            },
            () => fail("should be fail")
        );
    });

    it("should return Invalid email error if email is invalid", () => {
        const result = Credentials.create({
            email: invalidEmailInput,
            password: validPasswordInput,
        });

        result.fold(
            errors => {
                expect(errors["email"][0]).toBe("Invalid email");
            },
            () => fail("should be fail")
        );
    });
});
