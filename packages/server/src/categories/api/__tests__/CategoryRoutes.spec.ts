import { Category, CategoryData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { CategorysEndpoint } from "../CategoryRoutes";
import { categoryDIKeys } from "../../CategoryDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";

const entities = [
    Category.create({
        id: Id.generateId().value,
        name: "Female Kumite -50 Kg",
        typeId: Id.generateId().value,
    }).get(),
    Category.create({
        id: Id.generateId().value,
        name: "Male Kumite -60 Kg",
        typeId: Id.generateId().value,
    }).get(),
];

const principalDataCreator: ServerDataCreator<CategoryData, Category> = {
    repositoryKey: categoryDIKeys.categoryRepository,
    items: () => {
        return entities;
    },
};

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

commonCRUDTests(CategorysEndpoint, testDataCreator, principalDataCreator);
// Add especific items
