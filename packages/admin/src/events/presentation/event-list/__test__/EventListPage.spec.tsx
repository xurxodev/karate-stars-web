import React from "react";

import { EventData, Id } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import EventListPage from "../EventListPage";

const verifiableFields: (keyof EventData)[] = ["id", "name", "year"];

const dataListCreator = {
    givenADataList: (count: number): EventData[] => {
        const dataList = Array.from(Array(count).keys())
            .map((_, index) => {
                const code = ("0" + index).slice(-2);

                return {
                    id: Id.generateId().value,
                    name: `name ${code}`,
                    year: +("20" + code),
                    typeId: Id.generateId().value,
                };
            })
            .sort((a, b) => b.year - a.year);

        return dataList;
    },
};

commonListPageTests("events", verifiableFields, dataListCreator, <EventListPage />);
