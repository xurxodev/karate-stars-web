import React from "react";

import { EventData, Id } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import EventListPage from "../EventListPage";

const verifiableFields: (keyof EventData)[] = ["id", "name"];

const dataListCreator = {
    givenADataList: (count: number): EventData[] => {
        const dataList = Array.from(Array(count).keys())
            .map((_, index) => {
                const code = ("0" + index).slice(-2);

                return {
                    id: Id.generateId().value,
                    name: `name ${code}`,
                    typeId: Id.generateId().value,
                    startDate: new Date(+("20" + code), 1, 1),
                    endDate: new Date(+("20" + code), 1, 1),
                    url: "http://example.com/" + code,
                };
            })
            .sort((a, b) => b.startDate.getFullYear() - a.startDate.getFullYear());

        return dataList;
    },
};

commonListPageTests("events", verifiableFields, dataListCreator, <EventListPage />);
