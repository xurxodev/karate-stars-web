import React from "react";
import "@testing-library/jest-dom/extend-expect";

import {
    render,
    tl,
    renderDetailPageToEdit,
} from "../../../../common/testing/testing_library/custom";
import CountryDetailPage from "../CountryDetailPage";
import { CountryData } from "karate-stars-core";
import { commonDetailPageTests } from "../../../../common/testing/commonDetailPageTests.spec";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";

async function typeValidForm() {
    tl.typeByLabelText("Name (*)", "Example Example");
    tl.typeByLabelText("Iso2 (*)", "Ex");
}

const dataCreator = {
    givenAItem: (): CountryData => {
        return {
            id: "BDnednvQ1Db",
            name: "Example",
            iso2: "2",
        };
    },
};

const component = <CountryDetailPage />;
const endpoint = "countries";
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
            it("should be visible with text iso2 is required if name has value and then is clear it", async () => {
                await renderComponentToCreate();

                tl.typeAndClear("Iso2 (*)", "example");

                tl.verifyTextExists("Iso2 cannot be blank");
            });
        });
    });
    describe("to edit", () => {
        let item: CountryData;

        beforeEach(() => (item = givenAItem()));

        describe("initial values should be the expected values", () => {
            it("should have he expected values to load", async () => {
                await renderComponentToEdit(item.id);

                tl.verifyValueInField("Name (*)", item.name);
                tl.verifyValueInField("Iso2 (*)", item.iso2);
            });
        });
        describe("validation messages", () => {
            it("should be visible with text name is required if name has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Name (*)", item.name);
                tl.clear("Name (*)");
                tl.verifyTextExists("Name cannot be blank");
            });
            it("should be visible with text iso2 is required if iso2 has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Iso2 (*)", item.iso2);
                tl.clear("Iso2 (*)");
                tl.verifyTextExists("Iso2 cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                await renderComponentToEdit(item.id);

                typeValidForm();
                tl.verifyTextNotExists("Name cannot be blank");
                tl.verifyTextNotExists("Iso2 cannot be blank");
            });
        });
    });
});

function givenAItem(): CountryData {
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

    await tl.verifyPageIsReadyAsync();
}

async function renderComponentToEdit(id: string) {
    renderDetailPageToEdit(endpoint, id, component);

    await tl.verifyPageIsReadyAsync();
}
