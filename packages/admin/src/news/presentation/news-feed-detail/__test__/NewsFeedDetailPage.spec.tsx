import React from "react";
import "@testing-library/jest-dom/extend-expect";

import {
    render,
    tl,
    screen,
    renderDetailPageToEdit,
} from "../../../../common/testing/testing_library/custom";
import NewsFeedDetailPage from "../NewsFeedDetailPage";
import { NewsFeedData, RssType } from "karate-stars-core";
import { commonDetailPageTests } from "../../../../common/testing/commonDetailPageTests.spec";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";

function typeValidForm() {
    tl.typeByLabelText("Name (*)", "Xurxo dev");
    tl.typeByLabelText("Url (*)", "https://xurxodev.com/");
    tl.typeByLabelText("Language (*)", "es");
    tl.selectOption("Type (*)", "rss");
}

const dataCreator = {
    givenAItem: (): NewsFeedData => {
        return {
            id: "BDnednvQ1Db",
            name: "WKF News Center",
            language: "en",
            type: "rss" as RssType,
            image: "https://storage.googleapis.com/karatestars-1261.appspot.com/feeds/YHv96B5LZXn.png",
            url: "http://fetchrss.com/rss/59baa0d28a93f8a1048b4567777611407.xml",
        };
    },
};

const component = <NewsFeedDetailPage />;
const endpoint = "news-feeds";
const apiEndpoint = `/api/v1/${endpoint}`;

commonDetailPageTests(endpoint, dataCreator, typeValidForm, component);

describe(`${endpoint} detail page`, () => {
    beforeEach(() => givenAValidAuthenticatedUser());

    describe("to create", () => {
        describe("validation messages", () => {
            it("should be visible with text name is required if name has value and then is clear it", async () => {
                await renderComponentToCreate();

                tl.typeAndClear("Name (*)", "example");

                tl.verifyTextExists("Name cannot be blank");
            });
            it("should be visible with text invalid url if url is wrong ", async () => {
                await renderComponentToCreate();

                tl.typeByLabelText("Url (*)", "wrong url");

                tl.verifyTextExists("Invalid url");
            });
            it("should be visible with text url is required if url has value and then is clear it", async () => {
                await renderComponentToCreate();

                tl.typeAndClear("Url (*)", "example");

                tl.verifyTextExists("Url cannot be blank");
            });
            it("should be visible with text language is required if language has value and then is clear it", async () => {
                await renderComponentToCreate();

                tl.typeAndClear("Name (*)", "example");

                tl.verifyTextExists("Name cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                await renderComponentToCreate();

                typeValidForm();

                tl.verifyTextNotExists("Invalid Url");
                tl.verifyTextNotExists("Name cannot be blank");
                tl.verifyTextNotExists("Language cannot be blank");
            });
        });
    });
    describe("to edit", () => {
        let item: NewsFeedData;

        beforeEach(() => (item = givenAItem()));

        describe("initial values should be the expected values", () => {
            it("should have he expected values to load", async () => {
                await renderComponentToEdit(item.id);

                tl.verifyValueInField("Name (*)", item.name);
                tl.verifyValueInField("Url (*)", item.url);
                tl.verifyValueInField("Language (*)", item.language);
                tl.verifyValueInField("Type (*)", item.type);
            });
        });
        describe("validation messages", () => {
            it("should be visible with text name is required if name has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Name (*)", item.name);
                tl.clear("Name (*)");
                tl.verifyTextExists("Name cannot be blank");
            });
            it("should be visible with text invalid url if url is wrong ", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Url (*)", item.url);
                tl.clear("Url (*)");
                tl.typeByLabelText("Url (*)", "wrong url");
                tl.verifyTextExists("Invalid url");
            });
            it("should be visible with text url is required if url has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Url (*)", item.url);
                tl.clear("Url (*)");
                tl.verifyTextExists("Url cannot be blank");
            });
            it("should be visible with text language is required if language has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Language (*)", item.language);
                tl.clear("Language (*)");
                tl.verifyTextExists("Language cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Name (*)", item.name);
                typeValidForm();
                tl.verifyTextNotExists("Name cannot be blank");
                tl.verifyTextNotExists("Language cannot be blank");
            });
        });
    });
});

function givenAItem(): NewsFeedData {
    const item = dataCreator.givenAItem();

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: `${apiEndpoint}/${item.id}`,
            httpStatusCode: 200,
            response: item,
        },
    ]);

    return item;
}

async function renderComponentToCreate() {
    render(component);

    await screen.findByRole("button", { name: "Accept" });
}

async function renderComponentToEdit(id: string) {
    renderDetailPageToEdit(endpoint, id, component);

    await screen.findByRole("button", { name: "Accept" });
}
