import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "../../../common/testing/testing_library/custom";
import SendPushNotificationPage from "../SendPushNotificationPage";
import { givenAValidAuthenticatedUser } from "../../../common/testing/scenarios/UserTestScenarios";
import userEvent from "@testing-library/user-event";
import * as mockServerTest from "../../../common/testing/mockServerTest";

beforeEach(() => givenAValidAuthenticatedUser());

describe("Send push page", () => {
    describe("Send button", () => {
        it("should be disabled the first time", async () => {
            render(<SendPushNotificationPage />);

            expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
        });
        it("should be enabled after type url, title and description", () => {
            render(<SendPushNotificationPage />);

            userEvent.type(screen.getByLabelText("Url (*)"), "http://karatestarsapp.com/");
            userEvent.type(screen.getByLabelText("Title (*)"), "Karate stars news");
            userEvent.type(
                screen.getByLabelText("Description (*)"),
                "The best karate app of the world!!"
            );

            expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
        });
    });
    describe("validation messages", () => {
        it("should be visible with text invalid url if url is wrong ", () => {
            render(<SendPushNotificationPage />);

            userEvent.type(screen.getByLabelText("Url (*)"), "wrong url");

            expect(screen.getByText("Invalid url")).toBeInTheDocument();
        });
        it("should be visible with text url is required if url has value and then is clear it", () => {
            render(<SendPushNotificationPage />);

            userEvent.type(screen.getByLabelText("Url (*)"), "example");
            userEvent.clear(screen.getByLabelText("Url (*)"));

            expect(screen.getByText("Url cannot be blank")).toBeInTheDocument();
        });
        it("should be visible with text title is required if title has value and then is clear it", () => {
            render(<SendPushNotificationPage />);

            userEvent.type(screen.getByLabelText("Title (*)"), "example");
            userEvent.clear(screen.getByLabelText("Title (*)"));

            expect(screen.getByText("Title cannot be blank")).toBeInTheDocument();
        });
        it("should be visible with text description is required if description has value and then is clear it", () => {
            render(<SendPushNotificationPage />);

            userEvent.type(screen.getByLabelText("Title (*)"), "example");
            userEvent.clear(screen.getByLabelText("Title (*)"));

            expect(screen.getByText("Title cannot be blank")).toBeInTheDocument();
        });
        it("should any validation text visible if type valid all mandatory fields", () => {
            render(<SendPushNotificationPage />);

            userEvent.type(screen.getByLabelText("Url (*)"), "http://karatestarsapp.com/");
            userEvent.type(screen.getByLabelText("Title (*)"), "Karate stars news");
            userEvent.type(
                screen.getByLabelText("Description (*)"),
                "The best karate app of the world!!"
            );

            expect(screen.queryByText("Invalid Url")).not.toBeInTheDocument();
            expect(screen.queryByText("Url cannot be blank")).not.toBeInTheDocument();
            expect(screen.queryByText("Title cannot be blank")).not.toBeInTheDocument();
            expect(screen.queryByText("Description cannot be blank")).not.toBeInTheDocument();
        });
    });
    describe("After submit", () => {
        it("should show invalid crentials message if the credentials one are not valid", async () => {
            givenANotificationPushErrorServerResponse(401);
            const server = mockServerTest.server;

            render(<SendPushNotificationPage />);

            userEvent.selectOptions(screen.getByLabelText("Topic (*)"), "debugurlnews");
            userEvent.type(screen.getByLabelText("Url (*)"), "http://karatestarsapp.com/");
            userEvent.type(screen.getByLabelText("Title (*)"), "Karate stars news");
            userEvent.type(
                screen.getByLabelText("Description (*)"),
                "The best karate app of the world!!"
            );

            userEvent.click(screen.getByRole("button", { name: "Send" }));

            await screen.findByText("Invalid credentials");
        });
        it("should show generic error if an error has ocurred in the server", async () => {
            givenANotificationPushErrorServerResponse(500);

            render(<SendPushNotificationPage />);

            userEvent.selectOptions(screen.getByLabelText("Topic (*)"), "debugurlnews");
            userEvent.type(screen.getByLabelText("Url (*)"), "http://karatestarsapp.com/");
            userEvent.type(screen.getByLabelText("Title (*)"), "Karate stars news");
            userEvent.type(
                screen.getByLabelText("Description (*)"),
                "The best karate app of the world!!"
            );

            userEvent.click(screen.getByRole("button", { name: "Send" }));

            await screen.findByText(
                "Sorry, an error has ocurred in the server. Please try later again"
            );
        });

        it("should show success if an error has ocurred in the server", async () => {
            givenANotificationPushSuccessServerResponse();

            render(<SendPushNotificationPage />);

            userEvent.selectOptions(screen.getByLabelText("Topic (*)"), "debugurlnews");
            userEvent.type(screen.getByLabelText("Url (*)"), "http://karatestarsapp.com/");
            userEvent.type(screen.getByLabelText("Title (*)"), "Karate stars news");
            userEvent.type(
                screen.getByLabelText("Description (*)"),
                "The best karate app of the world!!"
            );

            userEvent.click(screen.getByRole("button", { name: "Send" }));

            await screen.findByText("Push notification sent successfully");
        });
    });
});

function givenANotificationPushErrorServerResponse(httpStatusCode: number) {
    mockServerTest.addRequestHandlers([
        {
            method: "post",
            endpoint: "https://fcm.googleapis.com/fcm/send",
            httpStatusCode: httpStatusCode,
            response: `The request fail`,
        },
    ]);
}

function givenANotificationPushSuccessServerResponse() {
    mockServerTest.addRequestHandlers([
        {
            method: "post",
            endpoint: "https://fcm.googleapis.com/fcm/send",
            httpStatusCode: 200,
            response: {
                message_id: 4769652491592676625,
            },
        },
    ]);
}
