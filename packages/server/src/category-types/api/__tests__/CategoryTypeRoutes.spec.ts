import { CategoryTypeData, CategoryType, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { CategoryTypesEndpoint } from "../CategoryTypeRoutes";
import { categoryTypeDIKeys } from "../../CategoryTypeDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";

const entities = [
    CategoryType.create({
        id: Id.generateId().value,
        name: "Kumite",
    }).get(),
    CategoryType.create({
        id: Id.generateId().value,
        name: "Kata",
    }).get(),
];

const principalDataCreator: ServerDataCreator<CategoryTypeData, CategoryType> = {
    repositoryKey: categoryTypeDIKeys.CategoryTypeRepository,
    items: () => {
        return entities;
    },
};

const testDataCreator: TestDataCreator<CategoryTypeData> = {
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
    givenAValidModifiedItem: (): CategoryTypeData => {
        return { ...entities[0].toData(), name: entities[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CategoryTypeData => {
        return { ...entities[0].toData(), name: "" };
    },
    givenAItemToDelete: (): CategoryTypeData => {
        return entities[0].toData();
    },
};

commonCRUDTests(CategoryTypesEndpoint, testDataCreator, principalDataCreator);

// Add especific items
