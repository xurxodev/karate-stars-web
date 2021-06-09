import React from "react";

import { CountryData, Id } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import CountryListPage from "../CountryListPage";

const verifiableFields: (keyof CountryData)[] = ["id", "name"];

const dataListCreator = {
    givenADataList: (count: number): CountryData[] => {
        const dataList = Array.from(Array(count).keys()).map((_, index) => {
            const code = ("0" + index).slice(-2);

            return {
                id: Id.generateId().value,
                name: `name ${code}`,
                iso2: code,
            };
        });

        return dataList;
    },
};

commonListPageTests("countries", verifiableFields, dataListCreator, <CountryListPage />);
