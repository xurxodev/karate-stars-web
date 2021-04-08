import { CategoryTypeData, CategoryType, Id } from "karate-stars-core";
import { commonCRUDTests, DataCreator } from "../../common/api/testUtils/crud.spec";
import { CategoryTypesEndpoint } from "../api/CategoryTypeRoutes";
import { categoryTypeDIKeys } from "../CategoryTypeDIModule";

const Categories = [
    CategoryType.create({
        id: Id.generateId().value,
        name: "Kumite",
    }).get(),
    CategoryType.create({
        id: Id.generateId().value,
        name: "Kata",
    }).get(),
];

const CategoryCreator: DataCreator<CategoryTypeData, CategoryType> = {
    givenAInitialItems: () => {
        return Categories;
    },
    givenAValidNewItem: () => {
        return { ...Categories[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...Categories[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CategoryTypeData => {
        return { ...Categories[0].toData(), name: Categories[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CategoryTypeData => {
        return { ...Categories[0].toData(), name: "" };
    },
};

commonCRUDTests(CategoryTypesEndpoint, categoryTypeDIKeys.CategoryTypeRepository, CategoryCreator);

// Add especific items
