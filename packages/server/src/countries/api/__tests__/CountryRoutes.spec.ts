import { Competitor, CompetitorData, Country, CountryData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { CountriesEndpoint } from "../CountryRoutes";
import { countryDIKeys } from "../../CountryDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import data from "./data.json";
import { competitorDIKeys } from "../../../competitors/CompetitorDIModule";
import {
    givenThereAreAnUserInServer,
    givenThereAreAPrincipalAndRestItemsInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";

const entities = {
    competitors: data.competitors.map(data => Competitor.create(data as CompetitorData).get()),
    countries: data.countries.map(data => Country.create(data).get()),
};

const principalDataCreator: ServerDataCreator<CountryData, Country> = {
    repositoryKey: countryDIKeys.countryRepository,
    items: () => {
        return entities.countries;
    },
};

const restDataCreators = [
    {
        repositoryKey: competitorDIKeys.CompetitorRepository,
        items: () => entities.competitors,
    },
];

const testDataCreator: TestDataCreator<CountryData> = {
    givenAValidNewItem: () => {
        return { ...entities.countries[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.countries[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CountryData => {
        return { ...entities.countries[0].toData(), name: entities.countries[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CountryData => {
        return { ...entities.countries[0].toData(), name: "" };
    },
    givenAItemToDelete: (): CountryData => {
        return entities.countries[1].toData();
    },
};

commonCRUDTests(CountriesEndpoint, testDataCreator, principalDataCreator, restDataCreators);

describe(`Invalid competitor dependency tests for ${CountriesEndpoint}`, () => {
    describe(`DELETE /${CountriesEndpoint}/{id}`, () => {
        it("should return 409 conflict if the item to deleted is used", async () => {
            const data = givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                restDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/${CountriesEndpoint}/${data[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(409);
        });
    });
});
