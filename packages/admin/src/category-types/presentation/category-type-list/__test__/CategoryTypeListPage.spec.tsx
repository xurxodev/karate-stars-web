import React from "react";

import { CategoryTypeData, Id } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import CategoryTypeListPage from "../CategoryTypeListPage";

const verifiableFields: (keyof CategoryTypeData)[] = ["name", "id"];

const dataListCreator = {
    givenADataList: (count: number): CategoryTypeData[] => {
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

commonListPageTests("category-types", verifiableFields, dataListCreator, <CategoryTypeListPage />);
