import { Ranking, RankingData } from "karate-stars-core";
import { ServerDataCreator } from "../../../common/api/testUtils/DataCreator";
import data from "./data.json";
import {
    givenThereAreAnUserInServer,
    givenThereAreAPrincipalAndRestItemsInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";
import { rankingsEndpoint } from "../RankingRoutes";
import { jsonParser } from "../../../common/api/testUtils/jsonParser";
import { rankingDIKeys } from "../../RankingDIModule";

const rankings = data.rankings.map(data => Ranking.create(data).get());

const principalDataCreator: ServerDataCreator<RankingData, Ranking> = {
    repositoryKey: rankingDIKeys.rankingRepository,
    items: () => {
        return rankings;
    },
};

describe(`CRUD tests for ${rankingsEndpoint}`, () => {
    describe(`GET /${rankingsEndpoint}`, () => {
        it("should return expected items if token is of an admin user", async () => {
            const data = givenThereAreAPrincipalAndRestItemsInServer(principalDataCreator);
            const user = givenThereAreAnUserInServer({ admin: true });

            const server = await initServer();

            const res = await request(server)
                .get(`/api/v1/${rankingsEndpoint}`)
                .parse(jsonParser)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(200);
            expect(res.body).toEqual(data);
        });
    });
});
