import { CategoryTypeData, CategoryType, Id, Category } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { categoryTypesEndpoint } from "../CategoryTypeRoutes";
import { categoryTypeDIKeys } from "../../CategoryTypeDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";
import data from "./data.json";
import { categoryDIKeys } from "../../../categories/CategoryDIModule";
import {
    givenThereAreAPrincipalAndRestItemsInServer,
    givenThereAreAnUserInServer,
} from "../../../common/api/testUtils/ScenariosFactory";
import { generateToken, initServer } from "../../../common/api/testUtils/serverTest";
import request from "supertest";

const entities = {
    categories: data.categories.map(data => Category.create(data).get()),
    categoryTypes: data.categoryTypes.map(data => CategoryType.create(data).get()),
};

const principalDataCreator: ServerDataCreator<CategoryTypeData, CategoryType> = {
    repositoryKey: categoryTypeDIKeys.CategoryTypeRepository,
    items: () => {
        return entities.categoryTypes;
    },
};

const restDataCreators = [
    {
        repositoryKey: categoryDIKeys.categoryRepository,
        items: () => entities.categories,
    },
];

const testDataCreator: TestDataCreator<CategoryTypeData> = {
    givenAValidNewItem: () => {
        return { ...entities.categoryTypes[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities.categoryTypes[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CategoryTypeData => {
        return {
            ...entities.categoryTypes[0].toData(),
            name: entities.categoryTypes[0].name + "modified",
        };
    },
    givenAInvalidModifiedItem: (): CategoryTypeData => {
        return { ...entities.categoryTypes[0].toData(), name: "" };
    },
    givenAItemToDelete: (): CategoryTypeData => {
        return entities.categoryTypes[1].toData();
    },
};

commonCRUDTests(categoryTypesEndpoint, testDataCreator, principalDataCreator, restDataCreators);

describe(`Delete error by constraint with category tests for ${categoryTypesEndpoint}`, () => {
    describe(`DELETE /${categoryTypesEndpoint}/{id}`, () => {
        it("should return 409 conflict if the item to deleted is used", async () => {
            const data = givenThereAreAPrincipalAndRestItemsInServer(
                principalDataCreator,
                restDataCreators
            );
            const user = givenThereAreAnUserInServer({ admin: true });
            const server = await initServer();

            const res = await request(server)
                .delete(`/api/v1/${categoryTypesEndpoint}/${data[0].id}`)
                .set({ Authorization: `Bearer ${generateToken(user.id.value)}` });

            expect(res.status).toEqual(409);
        });
    });
});
