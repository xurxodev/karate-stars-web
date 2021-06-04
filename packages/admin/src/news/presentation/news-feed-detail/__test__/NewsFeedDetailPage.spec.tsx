import React from "react";
import "@testing-library/jest-dom/extend-expect";

import { tl, render, screen } from "../../../../common/testing/testing_library/custom";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";
import NewsFeedDetailPage from "../NewsFeedDetailPage";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { Method } from "../../../../common/testing/mockServerTest";
import { Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import { NewsFeedData, RssType } from "karate-stars-core";

beforeEach(() => givenAValidAuthenticatedUser());

const existedId = "BDnednvQ1Db";

describe("News feed detail page", () => {
    describe("to create", () => {
        describe("accept button", () => {
            it("should be disabled the first time", async () => {
                renderComponentToCreate();

                tl.clickOnAccept();
            });
            it("should be enabled after type url, title and description", () => {
                renderComponentToCreate();

                typeValidForm();

                tl.clickOnAccept();
            });
        });
        describe("validation messages", () => {
            it("should be visible with text name is required if name has value and then is clear it", () => {
                renderComponentToCreate();

                tl.typeAndClear("Name (*)", "example");

                tl.verifyTextExists("Name cannot be blank");
            });
            it("should be visible with text invalid url if url is wrong ", () => {
                renderComponentToCreate();

                tl.typeByLabelText("Url (*)", "wrong url");

                tl.verifyTextExists("Invalid url");
            });
            it("should be visible with text url is required if url has value and then is clear it", () => {
                renderComponentToCreate();

                tl.typeAndClear("Url (*)", "example");

                tl.verifyTextExists("Url cannot be blank");
            });
            it("should be visible with text language is required if language has value and then is clear it", () => {
                renderComponentToCreate();

                tl.typeAndClear("Name (*)", "example");

                tl.verifyTextExists("Name cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", () => {
                renderComponentToCreate();

                typeValidForm();

                tl.verifyTextNotExists("Invalid Url");
                tl.verifyTextNotExists("Name cannot be blank");
                tl.verifyTextNotExists("Language cannot be blank");
            });
        });
        describe("After submit", () => {
            it("should show invalid crentials message if the server response is unauthorized", async () => {
                givenAErrorServerResponse("get", "/api/v1/news-feeds/:id", 401);

                renderComponentToCreate();

                typeValidForm();

                tl.clickOnAccept();

                await tl.verifyTextExistsAsync("Invalid credentials");
            });
            it("should show generic error if the server response is error", async () => {
                givenAErrorServerResponse("get", "/api/v1/news-feeds/:id", 404);

                givenAErrorServerResponse("post", "/api/v1/news-feeds/", 500);

                renderComponentToCreate();

                typeValidForm();

                tl.clickOnAccept();

                await tl.verifyTextExistsAsync(
                    "Sorry, an error has ocurred in the server. Please try later again"
                );
            });
            it("should show success if the server response is success", async () => {
                givenAErrorServerResponse("get", "/api/v1/news-feeds/:id", 404);

                givenASuccessServerResponse();

                renderComponentToCreate();

                typeValidForm();

                tl.clickOnAccept();

                await tl.verifyTextExistsAsync("News feed saved!");
            });
        });
    });
    describe("to edit", () => {
        let newsFeed: NewsFeedData;

        describe("initial values should be the expected values", () => {
            beforeEach(() => (newsFeed = givenANewsFeed(existedId)));

            it("should have he expected values to load", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", newsFeed.name);
                await tl.verifyValueInFieldAsync("Url (*)", newsFeed.url);
                await tl.verifyValueInFieldAsync("Language (*)", newsFeed.language);
                await tl.verifyValueInFieldAsync("Type (*)", newsFeed.type);
            });
        });
        describe("Accept button", () => {
            beforeEach(() => (newsFeed = givenANewsFeed(existedId)));

            it("should be disabled the first time", async () => {
                givenANewsFeed(existedId);

                renderComponentToEdit(existedId);

                expect(screen.getByRole("button", { name: "Accept" })).toBeDisabled();
            });
            it("should be enabled after type url, title and description", () => {
                renderComponentToEdit(existedId);

                typeValidForm();

                expect(screen.getByRole("button", { name: "Accept" })).toBeEnabled();
            });
        });
        describe("validation messages", () => {
            beforeEach(() => (newsFeed = givenANewsFeed(existedId)));

            it("should be visible with text name is required if name has value and then is clear it", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", newsFeed.name);

                tl.clear("Name (*)");

                tl.verifyTextExists("Name cannot be blank");
            });
            it("should be visible with text invalid url if url is wrong ", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Url (*)", newsFeed.url);

                tl.clear("Url (*)");

                tl.typeByLabelText("Url (*)", "wrong url");

                tl.verifyTextExists("Invalid url");
            });
            it("should be visible with text url is required if url has value and then is clear it", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Url (*)", newsFeed.url);
                tl.clear("Url (*)");

                tl.verifyTextExists("Url cannot be blank");
            });
            it("should be visible with text language is required if language has value and then is clear it", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Language (*)", newsFeed.language);

                tl.clear("Language (*)");

                tl.verifyTextExists("Language cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", newsFeed.name);

                typeValidForm();

                tl.verifyTextNotExists("Name cannot be blank");

                tl.verifyTextNotExists("Language cannot be blank");
            });
        });
        describe("After submit", () => {
            beforeEach(() => (newsFeed = givenANewsFeed(existedId)));

            it("should show invalid crentials message if the server response is unauthorized", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", newsFeed.name);

                typeValidForm();

                givenAErrorServerResponse("get", "/api/v1/news-feeds/:id", 401);

                tl.clickOnAccept();

                await tl.verifyTextExistsAsync("Invalid credentials");
            });
            it("should show generic error if the server response is error", async () => {
                renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", newsFeed.name);

                typeValidForm();

                givenANewsFeed(existedId);

                givenAErrorServerResponse("put", `/api/v1/news-feeds/${newsFeed.id}`, 500);

                tl.clickOnAccept();

                await tl.verifyTextExistsAsync(
                    "Sorry, an error has ocurred in the server. Please try later again"
                );
            });
            it("should show success if the server response is success", async () => {
                renderComponentToEdit(existedId);
                await tl.verifyValueInFieldAsync("Name (*)", newsFeed.name);

                typeValidForm();

                givenANewsFeed(existedId);

                givenASuccessServerResponse("put", `/api/v1/news-feeds/${newsFeed.id}`);

                tl.clickOnAccept();

                await tl.verifyTextExistsAsync("News feed saved!");
            });
        });
    });
});

function typeValidForm() {
    tl.typeByLabelText("Name (*)", "Xurxo dev");
    tl.typeByLabelText("Url (*)", "https://xurxodev.com/");
    tl.typeByLabelText("Language (*)", "es");
    tl.selectOption("Type (*)", "rss");
}

function renderComponentToCreate() {
    render(<NewsFeedDetailPage />);
}

function renderComponentToEdit(id: string) {
    const history = createMemoryHistory();
    history.push(`/news-feeds/${id}`);

    render(
        <Route path="/news-feeds/:id">
            <NewsFeedDetailPage />
        </Route>,
        {
            history,
        }
    );
}

function givenAErrorServerResponse(method: Method, endpoint: string, httpStatusCode: number) {
    mockServerTest.addRequestHandlers([
        {
            method,
            endpoint,
            httpStatusCode: httpStatusCode,
            response: {
                statusCode: httpStatusCode,
                error: "error",
                message: "error message",
            },
        },
    ]);
}

function givenASuccessServerResponse(
    method: Method = "post",
    endpoint = "/api/v1/news-feeds",
    httpStatusCode = 200
) {
    mockServerTest.addRequestHandlers([
        {
            method: method,
            endpoint,
            httpStatusCode: httpStatusCode,
            response: {
                ok: true,
                count: 1,
            },
        },
    ]);
}

function givenANewsFeed(id: string): NewsFeedData {
    const newsFeed = {
        id,
        name: "WKF News Center",
        language: "en",
        type: "rss" as RssType,
        image: "https://storage.googleapis.com/karatestars-1261.appspot.com/feeds/YHv96B5LZXn.png",
        url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
    };

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: `/api/v1/news-feeds/${existedId}`,
            httpStatusCode: 200,
            response: newsFeed,
        },
    ]);

    return newsFeed;
}
