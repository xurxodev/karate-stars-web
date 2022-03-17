import React from "react";

import {
    render,
    tl,
    screen,
    renderDetailPageToEdit,
    within,
} from "../../../../common/testing/testing_library/custom";
import { VideoData, VideoLinkData } from "karate-stars-core";
import { commonDetailPageTests } from "../../../../common/testing/commonDetailPageTests.spec";
import * as mockServerTest from "../../../../common/testing/mockServerTest";
import { givenAValidAuthenticatedUser } from "../../../../common/testing/scenarios/UserTestScenarios";
import data from "./data.json";
import { givenADependencies } from "../../../../common/testing/scenarios/GenericScenarios";
import VideoDetailPage from "../VideoDetailPage";

const dataCreator = {
    givenAItem: (): VideoData => {
        const video = data.videos[0];
        return {
            ...video,
            eventDate: new Date(video.eventDate),
            createdDate: new Date(video.createdDate),
            links: video.links.map(link => ({ ...link, type: link.type } as VideoLinkData)),
            isLive: false,
        };
    },
};

const dependenciesCreators = [
    {
        endpoint: "competitors",
        items: () => data.competitors,
    },
];

async function typeValidForm() {
    tl.typeByLabelText("Title (*)", "World Championships 2014");
    tl.typeByLabelText("Subtitle (*)", "G. Lotfy (EGY) - S. Jefry (MAS)");
    tl.typeByLabelText("Description (*)", "Kumite -61 Final");
    tl.typeByLabelText("Event Date (*)", "2014-11-08");
    tl.typeByLabelText("Order (*)", "0");

    //Mirar algo de seleccionar especifico con react select y testing library!!!!!
    await tl.selectMultiOption(
        "Competitors",
        `${data.competitors[1].firstName} ${data.competitors[1].lastName}`
    );

    await typeValidLinkForm();

    await tl.verifySubmitIsEnabledAsync();
}

async function typeValidLinkForm() {
    tl.clickOnButtonByLabel("add");

    const linkDialog = await screen.findByRole("dialog");
    expect(linkDialog).toBeInTheDocument();

    const dialogScope = within(linkDialog);

    tl.typeByLabelText("Id (*)", "example");
    tl.selectOption("Type (*)", "youtube");

    tl.clickOnButtonByLabelTextAndScope("ok", dialogScope);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
}

const component = <VideoDetailPage />;
const endpoint = "videos";
const apiEndpoint = `/api/v1/${endpoint}`;

commonDetailPageTests(endpoint, dataCreator, typeValidForm, component, dependenciesCreators);

describe(`${endpoint} detail page`, () => {
    beforeEach(() => {
        givenAValidAuthenticatedUser();
        givenADependencies(dependenciesCreators);
    });

    describe("to create", () => {
        describe("validation messages", () => {
            it("should be visible with text title is required if title has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("Title (*)", "example");
                tl.verifyTextExists("Title cannot be blank");
            });
            it("should be visible with text subtitle is required if subtitle has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("Subtitle (*)", "example");
                tl.verifyTextExists("Subtitle cannot be blank");
            });
            it("should be visible with text description is required if description has value and then is clear it", async () => {
                await renderComponentToCreate();
                tl.typeAndClear("Description (*)", "example");
                tl.verifyTextExists("Description cannot be blank");
            });
        });
    });
    describe("to edit", () => {
        let item: VideoData;

        beforeEach(() => (item = givenAItem()));

        describe("initial values should be the expected values", () => {
            it("should have he expected values to load", async () => {
                await renderComponentToEdit(item.id);

                tl.verifyValueInField("Title (*)", item.title);
                tl.verifyValueInField("Subtitle (*)", item.subtitle);
                tl.verifyValueInField("Description (*)", item.description);
            });
        });
        describe("validation messages", () => {
            it("should be visible with text title is required if title has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Title (*)", item.title);
                tl.clear("Title (*)");
                tl.verifyTextExists("Title cannot be blank");
            });
            it("should be visible with text subtitle is required if subtitle has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Subtitle (*)", item.subtitle);
                tl.clear("Subtitle (*)");
                tl.verifyTextExists("Subtitle cannot be blank");
            });
            it("should be visible with text description is required if subtitle has value and then is clear it", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Description (*)", item.description);
                tl.clear("Description (*)");
                tl.verifyTextExists("Description cannot be blank");
            });
            it("should any validation text visible if type valid all mandatory fields", async () => {
                await renderComponentToEdit(item.id);

                await tl.verifyValueInFieldAsync("Title (*)", item.title);
                typeValidForm();
                tl.verifyTextNotExists("Title cannot be blank");
                tl.verifyTextNotExists("Subtitle cannot be blank");
                tl.verifyTextNotExists("Description cannot be blank");
            });
        });
    });
});

function givenAItem(): VideoData {
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
