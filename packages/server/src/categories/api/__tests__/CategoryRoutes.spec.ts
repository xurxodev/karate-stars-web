import {
    Category,
    CategoryData,
    CategoryType,
    Competitor,
    CompetitorData,
    Id,
} from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { categoriesEndpoint } from "../CategoryRoutes";
import { categoryDIKeys } from "../../CategoryDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import { categoryTypeDIKeys } from "../../../category-types/CategoryTypeDIModule";
import {
    givenThereAreAPrincipalAndRestItemsInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";
import { competitorDIKeys } from "../../../competitors/CompetitorDIModule";
import data from "./data.json";

const entities = {
    competitors: data.competitors.map(data => Competitor.create(data as CompetitorData).get()),
    categories: data.categories.map(data => Category.create(data).get()),
    categoryTypes: data.categoryTypes.map(data => CategoryType.create(data).get()),
};

const principalDataCreator: ServerDataCreator<CategoryData, Category> = {
    repositoryKey: categoryDIKeys.categoryRepository,
    items: () => {
        return entities.categories;
    },
};

const restDataCreators = [
    {
        repositoryKey: categoryTypeDIKeys.CategoryTypeRepository,
        items: () => entities.categoryTypes,
    },
    {
        repositoryKey: competitorDIKeys.CompetitorRepository,
        items: () => entities.competitors,
    },
];

const testDataCreator: TestDataCreator<CategoryData> = {
    givenAValidNewItem: () => {
        return { ...entities.categories[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.categories[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CategoryData => {
        return {
            ...entities.categories[0].toData(),
            name: entities.categories[0].name + "modified",
        };
    },
    givenAInvalidModifiedItem: (): CategoryData => {
        return { ...entities.categories[0].toData(), name: "" };
    },
    givenAItemToDelete: (): CategoryData => {
        return entities.categories[1].toData();
    },
};

commonCRUDTests(categoriesEndpoint, testDataCreator, principalDataCreator, restDataCreators);
// Add especific items

describe(`Invalid category dependency tests for ${categoriesEndpoint}`, () => {
    describe(`POST /${categoriesEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(principalDataCreator, restDataCreators);
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidNewItem(), typeId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .post(`/api/v1/${categoriesEndpoint}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
    describe(`PUT /${categoriesEndpoint}/{id}`, () => {
        it("should return 400 bad request if body contains non existed typeId", async () => {
            givenThereAreAPrincipalAndRestItemsInServer(principalDataCreator, restDataCreators);
            const user = givenThereAreAnUserInServer({ admin: true });
            const item = { ...testDataCreator.givenAValidModifiedItem(), typeId: "Aa6N73CZWtE" };

            const server = await initServer();

            const res = await request(server)
                .put(`/api/v1/${categoriesEndpoint}/${item.id}`)
                .send(item)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(400);
        });
    });
});
describe(`Delete error by constraint with competitor tests for ${categoriesEndpoint}`, () => {
    describe(`DELETE /${categoriesEndpoint}/{id}`, () => {
        it("should return 409 conflict if the item to deleted is used", async () => {
            const data = givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                restDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/${categoriesEndpoint}/${data[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(409);
        });
    });
});
