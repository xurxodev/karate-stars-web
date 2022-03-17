import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, tl } from "../../../common/testing/testing_library/custom";
import * as mockServerTest from "../../../common/testing/mockServerTest";
import userEvent from "@testing-library/user-event";
import LoginPage from "../LoginPage";
import RedirectTester from "../../../common/testing/testing_library/RedirectTester";
import { pages } from "../../../common/presentation/PageRoutes";

const submit = /sign in/i;

describe("Login Page", () => {
    describe("Sign in button", () => {
        it("should be disabled the first time", async () => {
            render(<LoginPage />);

            await tl.verifySubmitIsDisabledAsync(submit);
        });
        it("should be enabled after type email and password", async () => {
            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Email"), "example@gmail.com");
            userEvent.type(screen.getByLabelText("Password"), "password");

            await tl.verifySubmitIsEnabledAsync(submit);
        });
    });
    describe("validation messages", () => {
        it("should be visible with text invalid email if email is empty ", () => {
            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Email"), "example");

            expect(screen.getByText("Invalid email")).toBeInTheDocument();
        });
        it("should be visible with text email is required if email has value and then is clear it", () => {
            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Email"), "example");
            userEvent.clear(screen.getByLabelText("Email"));

            expect(screen.getByText("Email cannot be blank")).toBeInTheDocument();
        });
        it("should be visible with text password is required if password has value and then is clear it", () => {
            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Password"), "example");
            userEvent.clear(screen.getByLabelText("Password"));

            expect(screen.getByText("Password cannot be blank")).toBeInTheDocument();
        });
        it("should be enabled after type email and password", () => {
            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Email"), "example@gmail.com");

            expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
            expect(screen.queryByText("Email cannot be blank")).not.toBeInTheDocument();
            expect(screen.queryByText("Invalid password")).not.toBeInTheDocument();
        });
    });
    describe("After submit", () => {
        it("should show invalid crentials message if the credentials one are not valid", async () => {
            givenAnUnauthorizedServerResponse(401);

            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Email"), "example@gmail.com");
            userEvent.type(screen.getByLabelText("Password"), "password");

            tl.clickOnSubmit(submit);

            await screen.findByText("Invalid credentials");
        });
        it("should show generic error if an error has ocurred in the server", async () => {
            givenAnUnauthorizedServerResponse(500);

            render(<LoginPage />);

            userEvent.type(screen.getByLabelText("Email"), "example@gmail.com");
            userEvent.type(screen.getByLabelText("Password"), "password");

            tl.clickOnSubmit(submit);

            await screen.findByText(
                "Sorry, an error has ocurred in the server. Please try later again"
            );
        });
        it("should navigate to dashboard if credentials are valid", async () => {
            givenASuccesfullyLoginResponse();

            render(
                <RedirectTester
                    componentWithRedirection={LoginPage}
                    expectedRedirectUrl={pages.dashboard.path}
                />
            );

            userEvent.type(screen.getByLabelText("Email"), "example@gmail.com");
            userEvent.type(screen.getByLabelText("Password"), "password");

            tl.clickOnSubmit(submit);

            screen.findByText(pages.dashboard.path);
        });
    });
});
function givenASuccesfullyLoginResponse() {
    const user = {
        id: "ID",
        name: "NAME",
        image: "IMAGE",
        email: "EMAIL",
        password: "PASSWORD",
        isAdmin: true,
        isClientUser: true,
    };

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: "/api/v1/me",
            httpStatusCode: 200,
            response: user,
        },
        {
            method: "post",
            endpoint: "/api/v1/login",
            httpStatusCode: 200,
            response: user,
        },
    ]);

    return user;
}

function givenAnUnauthorizedServerResponse(httpStatusCode: number) {
    mockServerTest.addRequestHandlers([
        {
            method: "post",
            endpoint: "/api/v1/login",
            httpStatusCode: httpStatusCode,
            response: {
                statusCode: httpStatusCode,
                error: "error",
                message: "message",
            },
        },
    ]);
}
