import { Competitor, CompetitorData, Id, Video, VideoData } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { videoDIKeys } from "../../VideoDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import { competitorDIKeys } from "../../../competitors/CompetitorDIModule";
import data from "./data.json";
import { videosEndpoint } from "../VideoRoutes";
import {
    givenThereAreAPrincipalAndRestItemsInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";

const entities = {
    competitors: data.competitors.map(data => Competitor.create(data as CompetitorData).get()),
    videos: data.videos.map(data =>
        Video.create({
            ...data,
            createdDate: new Date(data.createdDate),
            eventDate: new Date(data.eventDate),
        } as VideoData).get()
    ),
};

const principalDataCreator: ServerDataCreator<VideoData, Video> = {
    repositoryKey: videoDIKeys.videoRepository,
    items: () => entities.videos,
};

const dependenciesDataCreators = [
    {
        repositoryKey: competitorDIKeys.CompetitorRepository,
        items: () => entities.competitors,
    },
];

const testDataCreator: TestDataCreator<VideoData> = {
    givenAValidNewItem: () => {
        return { ...entities.videos[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.videos[0].toData(),
            id: Id.generateId().value,
            title: "",
        };
    },
    givenAValidModifiedItem: (): VideoData => {
        return { ...entities.videos[0].toData(), title: entities.videos[0].title + "modified" };
    },
    givenAInvalidModifiedItem: (): VideoData => {
        return { ...entities.videos[0].toData(), title: "" };
    },
    givenAItemToDelete: (): VideoData => {
        return entities.videos[0].toData();
    },
};

commonCRUDTests(videosEndpoint, testDataCreator, principalDataCreator, dependenciesDataCreators);
// Add especific items

describe(`Invalid competitor dependency tests for ${videosEndpoint}`, () => {
    describe(`POST /${videosEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidNewItem(), competitors: ["Aa6N73CZWtE"] };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${videosEndpoint}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${videosEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains non existed typeId", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = {
                ...testDataCreator.givenAValidModifiedItem(),
                competitors: ["Aa6N73CZWtE"],
            };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${videosEndpoint}/${item.id}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
