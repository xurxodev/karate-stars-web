import React from "react";

import { Id, VideoData, VideoLinkType } from "karate-stars-core";
import { commonListPageTests } from "../../../../common/testing/commonListPageTests.spec";

import VideoListPage from "../VideoListPage";

const verifiableFields: (keyof VideoData)[] = ["title", "description", "subtitle"];

const dataListCreator = {
    givenADataList: (count: number): VideoData[] => {
        const dataList = Array.from(Array(count).keys()).map((_, index) => {
            const code = ("0" + index).slice(-2);

            return {
                id: Id.generateId().value,
                links: [
                    {
                        id: "o4guDvlaxMQ",
                        type: "youtube" as VideoLinkType,
                    },
                ],
                title: `title ${code}`,
                description: `description ${code}`,
                subtitle: `subtitle ${code}`,
                competitors: ["tjZtIOHwzVJ"],
                eventDate: new Date(2022, 1, index),
                createdDate: new Date(2022, 1, index),
                order: index,
                isLive: false,
            };
        });

        return dataList.sort((a, b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        });
    },
};

commonListPageTests("videos", verifiableFields, dataListCreator, <VideoListPage />);
