import { Id, RankingEntry, RankingEntryData } from "karate-stars-core";
import { ServerDataCreator } from "../../../common/api/testUtils/DataCreator";
import data from "./data.json";
import {
    givenThereAreAnUserInServer,
    givenThereAreAPrincipalAndRestItemsInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";
import { jsonParser } from "../../../common/api/testUtils/jsonParser";
import { rankingDIKeys } from "../../RankingDIModule";
import { rankingEntriesEndpoint } from "../RankingEntriesRoutes";
import * as CompositionRoot from "../../../CompositionRoot";

const rankingEntries = data.rankingEntries.map(data => RankingEntry.create(data).get());

const principalDataCreator: ServerDataCreator<RankingEntryData, RankingEntry> = {
    repositoryKey: rankingDIKeys.rankingEntryRepository,
    items: () => {
        return rankingEntries;
    },
};

function givenThereAreAnItemsInServer() {
    CompositionRoot.di.bindLazySingleton(principalDataCreator.repositoryKey, () => ({
        get: (rankingId: Id, categoryId: Id) => {
            return rankingEntries.filter(
                (entry: RankingEntry) =>
                    entry.rankingId.value === rankingId.value &&
                    entry.categoryId.value === categoryId.value
            );
        },
    }));

    return rankingEntries.map(entry => entry.toData());
}

describe(`CRUD tests for ${rankingEntriesEndpoint}`, () => {
    describe(`GET /${rankingEntriesEndpoint}`, () => {
        it("should return expected items if token is of an admin user", async () => {
            const data = givenThereAreAnItemsInServer();
            const user = givenThereAreAnUserInServer({ admin: true });

            const server = await initServer();

            const res = await request(server)
                .get(
                    `/api/v1/${rankingEntriesEndpoint}?rankingId=vnsabLUirBx&categoryId=kMe2wqSvf2O`
                )
                .parse(jsonParser)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(200);
            expect(res.body).toEqual(data);
        });
    });
});
