import React from "react";

import { EventTypeData, Id } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import EventTypeListPage from "../EventTypeListPage";

const verifiableFields: (keyof EventTypeData)[] = ["name", "id"];

const dataListCreator = {
    givenADataList: (count: number): EventTypeData[] => {
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

commonListPageTests("event-types", verifiableFields, dataListCreator, <EventTypeListPage />);
