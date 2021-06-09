import React from "react";

import { CategoryData, Id } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import CategoryListPage from "../CategoryListPage";

const verifiableFields: (keyof CategoryData)[] = ["id", "name"];

const dataListCreator = {
    givenADataList: (count: number): CategoryData[] => {
        const dataList = Array.from(Array(count).keys()).map((_, index) => {
            const code = ("0" + index).slice(-2);

            return {
                id: Id.generateId().value,
                name: `name ${code}`,
                typeId: Id.generateId().value,
            };
        });

        return dataList;
    },
};

commonListPageTests("categories", verifiableFields, dataListCreator, <CategoryListPage />);
