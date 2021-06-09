import React from "react";

import { Id, CompetitorData, SocialLinkType } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import CompetitorListPage from "../CompetitorListPage";

const verifiableFields: (keyof CompetitorData)[] = ["firstName", "lastName", "wkfId", "id"];

const dataListCreator = {
    givenADataList: (count: number): CompetitorData[] => {
        const dataList = Array.from(Array(count).keys()).map((_, index) => {
            const code = ("0" + index).slice(-2);

            return {
                id: Id.generateId().value,
                firstName: `firstName ${code}`,
                lastName: `lastName ${code}`,
                wkfId: code,
                biography: `biography ${code}`,
                countryId: "JZlQc0xbmlp",
                categoryId: "Gps5nVcCdjV",
                mainImage: `http://www.karatestarsapp.com/app/images/emily${code}.jpg`,
                isActive: true,
                isLegend: false,
                links: [
                    {
                        url: `https://twitter.com/${code}`,
                        type: "twitter" as SocialLinkType,
                    },
                ],
                achievements: [
                    {
                        eventId: "tE9zuEjkfpC",
                        categoryId: "kY6eNgWEXbw",
                        position: 1,
                    },
                ],
            };
        });

        return dataList;
    },
};

commonListPageTests("competitors", verifiableFields, dataListCreator, <CompetitorListPage />);
