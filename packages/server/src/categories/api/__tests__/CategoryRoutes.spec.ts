import { Category, CategoryData, CategoryType, CategoryTypeData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { categoriesEndpoint } from "../CategoryRoutes";
import { categoryDIKeys } from "../../CategoryDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import { categoryTypeDIKeys } from "../../../category-types/CategoryTypeDIModule";
import {
    givenThereAreAnItemsAndDependenciesInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";

const entities = [
    Category.create({
        id: "wZgo8Vp77gR",
        name: "Female Kumite -50 Kg",
        typeId: "Gps5nVcCdjV",
    }).get(),
    Category.create({
        id: "kMe2wqSvf2O",
        name: "Male Kumite -60 Kg",
        typeId: "Gps5nVcCdjV",
    }).get(),
];

const categoryTypeDependencies = [
    CategoryType.create({
        id: "Gps5nVcCdjV",
        name: "Kumite",
    }).get(),
    CategoryType.create({
        id: "qWPs4i1e78g",
        name: "Kata",
    }).get(),
];

const principalDataCreator: ServerDataCreator<CategoryData, Category> = {
    repositoryKey: categoryDIKeys.categoryRepository,
    items: () => {
        return entities;
    },
};

const dependenciesDataCreators: ServerDataCreator<CategoryTypeData, CategoryType>[] = [
    {
        repositoryKey: categoryTypeDIKeys.CategoryTypeRepository,
        items: () => {
            return categoryTypeDependencies;
        },
    },
];

const testDataCreator: TestDataCreator<CategoryData> = {
    givenAValidNewItem: () => {
        return { ...entities[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CategoryData => {
        return { ...entities[0].toData(), name: entities[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CategoryData => {
        return { ...entities[0].toData(), name: "" };
    },
};

commonCRUDTests(
    categoriesEndpoint,
    testDataCreator,
    principalDataCreator,
    dependenciesDataCreators
);
// Add especific items

describe(`Invalid categoryType dependency tests for ${categoriesEndpoint}`, () => {
    describe(`POST /${categoriesEndpoint}`, () => {
        it("should return 400 bad request if body contains invalid field values", async () => {
            givenThereAreAnItemsAndDependenciesInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
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
            givenThereAreAnItemsAndDependenciesInServer(
                principalDataCreator,
                dependenciesDataCreators
            );
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
