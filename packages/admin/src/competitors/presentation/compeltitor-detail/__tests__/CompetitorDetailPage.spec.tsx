import React from "react";

import {
    render,
    tl,
    screen,
    renderDetailPageToEdit,
    within,
} from "../../../../common/testing/testing_library/custom";
import { AchievementData, CompetitorData, SocialLinkData } from "karate-stars-core";
import { commonDetailPageTests } from "../../../../common/testing/commonDetailPageTests.spec";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";
import data from "./data.json";
import { givenADependencies } from "../../../../common/testing/scenarios/GenericScenarios";
import CompetitorDetailPage from "../CompetitorDetailPage";

const dataCreator = {
    givenAItem: (): CompetitorData => {
        const competitors = data.competitors[0];
        return {
            ...competitors,
            links: competitors.links.map(link => ({ ...link } as SocialLinkData)),
            achievements: competitors.achievements.map(
                achievement => ({ ...achievement } as AchievementData)
            ),
        };
    },
};

const dependenciesCreators = [
    {
        endpoint: "countries",
        items: () => data.countries,
    },
    {
        endpoint: "categories",
        items: () => data.categories,
    },
    {
        endpoint: "events",
        items: () => data.events,
    },
];

async function typeValidForm() {
    tl.typeByLabelText("First Name (*)", "Giana");
    tl.typeByLabelText("Last Name (*)", "Lotfy");
    tl.typeByLabelText("WKF Id (*)", "EGY253");
    tl.selectOption("Country (*)", "Egypt");
    tl.selectOption("Category (*)", "Female Kumite -68 Kg");
    tl.clickByLabelText("Active");
    tl.clickByLabelText("Legend");
    tl.typeByLabelText("Biography (*)", "Example example");

    await typeValidAchievementForm();
    await typeValidLinkForm();

    await tl.verifySubmitIsEnabledAsync();
}

async function typeValidLinkForm() {
    tl.clickOnButtonByLabel("Add link");

    const linkDialog = await screen.findByRole("dialog");
    expect(linkDialog).toBeInTheDocument();

    const dialogScope = within(linkDialog);

    tl.typeByLabelText("Url (*)", "https://xurxodev.com");
    //tl.selectOptionByLabelTextAndScope("Type (*)", "web", dialogScope);

    tl.clickOnButtonByLabelTextAndScope("ok", dialogScope);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
}

async function typeValidAchievementForm() {
    tl.clickOnButtonByLabel("Add achievement");

    const achievementDialog = await screen.findByRole("dialog");
    expect(achievementDialog).toBeInTheDocument();

    const achievementDialogScope = within(achievementDialog);

    // tl.selectOptionByLabelTextAndScope("Achievement Category (*)", "QaFq0Lf2YDR", achievementDialogScope);
    // tl.selectOptionByLabelTextAndScope("Event (*)", "QaFq0Lf2YDR", achievementDialogScope);

    tl.typeByLabelTextAndScope("Position (*)", "1", achievementDialogScope);

    tl.clickOnButtonByLabelTextAndScope("ok", achievementDialogScope);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
}

const component = <CompetitorDetailPage />;
const endpoint = "competitors";
const apiEndpoint = `/api/v1/${endpoint}`;

commonDetailPageTests(endpoint, dataCreator, typeValidForm, component, dependenciesCreators);

describe(`${endpoint} detail page`, () => {
    beforeEach(() => {
        givenAValidAuthenticatedUser();
        givenADependencies(dependenciesCreators);
    });

    describe("to create", () => {
        describe("validation messages", () => {
            it("should be visible with text title is required if first name has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("First Name (*)", "example");
                tl.verifyTextExists("FirstName cannot be blank");
            });
            it("should be visible with text title is required if last name has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("Last Name (*)", "example");
                tl.verifyTextExists("LastName cannot be blank");
            });
            it("should be visible with text WKF Id is required if wkf id has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("WKF Id (*)", "example");
                tl.verifyTextExists("WkfId cannot be blank");
            });
            it("should be visible with text biography is required if wkf id has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("Biography (*)", "example");
                tl.verifyTextExists("Biography cannot be blank");
            });
        });
    });
    describe("to edit", () => {
        let item: CompetitorData;

        beforeEach(() => (item = givenAItem()));

        describe("initial values should be the expected values", () => {
            it("should have he expected values to load", async () => {
                await renderComponentToEdit(item.id);

                tl.verifyValueInField("First Name (*)", item.firstName);
                tl.verifyValueInField("Last Name (*)", item.lastName);
                tl.verifyValueInField("WKF Id (*)", item.wkfId);
                tl.verifyValueInField("Biography (*)", item.biography);
            });
        });
        describe("validation messages", () => {
            it("should be visible with text first name is required if title has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("First Name (*)", item.firstName);
                tl.clear("First Name (*)");
                tl.verifyTextExists("FirstName cannot be blank");
            });
            it("should be visible with text last name is required if subtitle has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Last Name (*)", item.lastName);
                tl.clear("Last Name (*)");
                tl.verifyTextExists("LastName cannot be blank");
            });
            it("should be visible with text wkf id is required if subtitle has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("WKF Id (*)", item.wkfId);
                tl.clear("WKF Id (*)");
                tl.verifyTextExists("WkfId cannot be blank");
            });
            it("should be visible with text biography id is required if subtitle has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Biography (*)", item.biography);
                tl.clear("Biography (*)");
                tl.verifyTextExists("Biography cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                await renderComponentToEdit(item.id);

                typeValidForm();
                tl.verifyTextNotExists("FirstName cannot be blank");
                tl.verifyTextNotExists("LastName cannot be blank");
                tl.verifyTextNotExists("WkfId cannot be blank");
                tl.verifyTextNotExists("Biography cannot be blank");
            });
        });
    });
});

function givenAItem(): CompetitorData {
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
