import { Category, CategoryData, Id } from "karate-stars-core";
import { commonCRUDTests, DataCreator } from "../../../common/api/testUtils/crud.spec";
import { CategorysEndpoint } from "../CategoryRoutes";
import { categoryDIKeys } from "../../CategoryDIModule";

const Categories = [
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

const CategoryCreator: DataCreator<CategoryData, Category> = {
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
    givenAValidModifiedItem: (): CategoryData => {
        return { ...Categories[0].toData(), name: Categories[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CategoryData => {
        return { ...Categories[0].toData(), name: "" };
    },
};

commonCRUDTests(CategorysEndpoint, categoryDIKeys.categoryRepository, CategoryCreator);

// Add especific items
