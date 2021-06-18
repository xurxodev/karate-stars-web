import React from "react";
import "@testing-library/jest-dom/extend-expect";

import {
    render,
    tl,
    screen,
    renderDetailPageToEdit,
} from "../../../../common/testing/testing_library/custom";
import CategoryTypeDetailPage from "../CategoryTypeDetailPage";
import { CategoryTypeData } from "karate-stars-core";
import { commonDetailPageTests } from "../../../../common/testing/commonDetailPageTests.spec";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";

function typeValidForm() {
    tl.typeByLabelText("Name (*)", "Example Example");
}

const dataCreator = {
    givenAItem: (id: string): CategoryTypeData => {
        return {
            id,
            name: "Example",
        };
    },
};

const component = <CategoryTypeDetailPage />;
const endpoint = "category-types";
const apiEndpoint = `/api/v1/${endpoint}`;
const existedId = "BDnednvQ1Db";

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
        });
    });
    describe("to edit", () => {
        let item: CategoryTypeData;

        beforeEach(() => (item = givenAItem(existedId)));

        describe("initial values should be the expected values", () => {
            it("should have he expected values to load", async () => {
                await renderComponentToEdit(existedId);

                tl.verifyValueInField("Name (*)", item.name);
            });
        });
        describe("validation messages", () => {
            it("should be visible with text name is required if name has value and then is clear it", async () => {
                await renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", item.name);
                tl.clear("Name (*)");
                tl.verifyTextExists("Name cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                await renderComponentToEdit(existedId);

                await tl.verifyValueInFieldAsync("Name (*)", item.name);
                typeValidForm();
                tl.verifyTextNotExists("Name cannot be blank");
            });
        });
    });
});

function givenAItem(id: string): CategoryTypeData {
    const item = dataCreator.givenAItem(id);

    mockServerTest.addRequestHandlers([
        {
            method: "get",
            endpoint: `${apiEndpoint}/${id}`,
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
