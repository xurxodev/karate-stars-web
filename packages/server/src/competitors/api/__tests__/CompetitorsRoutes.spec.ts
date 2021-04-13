import { Id, Competitor, SocialLinkType, CompetitorData } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { CompetitorsEndpoint } from "../CompetitorRoutes";
import { competitorDIKeys } from "../../CompetitorDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";

const entities = [
    Competitor.create({
        id: Id.generateId().value,
        firstName: "Iryna",
        lastName: "Zaretska",
        wkfId: "AZE2043",
        biography:
            "Iryna Zaretska (4 March 1996 in Ukraine) is a Ukrainian and Azerbaijani karateka. \nShe won for Ukraine a bronze medal in kumite less than 68 at the 2014 Karate World Championships in Bremen, then for Azerbaijan the gold medal in the same category at the 2015 European Games in Baku and in QihGhQpPpiI at the 2016 European Karate Championships in Montpellier. \nShe is a gold medalist at the 2017 Islamic Solidarity Games in Baku and a silver medalist at the 2018 Karate European Championships in Novi Sad. \nShe was proclaimed World Champion in November 2018 in Madrid.",
        countryId: "uIaQv0JlN5n",
        categoryId: "Gps5nVcCdjV",
        mainImage: "http://www.karatestarsapp.com/app/images/iryna_zaretska.jpg",
        isActive: true,
        isLegend: false,
        links: [
            {
                url: "https://twitter.com/IrynaZaretska",
                type: "twitter",
            },
            {
                url: "https://www.facebook.com/iryna.zaretska.3",
                type: "facebbok" as SocialLinkType,
            },
            {
                url: "https://www.instagram.com/irynazaretska",
                type: "instagram" as SocialLinkType,
            },
        ],
        achievements: [
            {
                eventId: "gy5jc1IU2mN",
                categoryId: "vBqpirnDr9q",
                position: 3,
            },
            {
                eventId: "aliiuRjOllO",
                categoryId: "vBqpirnDr9q",
                position: 1,
            },
        ],
    }).get(),
    Competitor.create({
        id: Id.generateId().value,
        firstName: "Giana",
        lastName: "Lotfy",
        wkfId: "EGY253",
        biography:
            "Gianna Lotfy is an Egyptian karateka who was proclaimed world champion in 2014 at the age of 20 years. He has also been world champion in junior and under-21 categories.",
        countryId: "AsfJyc10miO",
        categoryId: "Gps5nVcCdjV",
        mainImage: "http://www.karatestarsapp.com/app/images/giana_lotfy.jpg",
        isActive: true,
        isLegend: false,
        links: [
            {
                url: "https://www.instagram.com/gianafarouk",
                type: "instagram" as SocialLinkType,
            },
        ],
        achievements: [
            {
                eventId: "VYgzwBJyuLz",
                categoryId: "qtYzfVYc50L",
                position: 1,
            },
            {
                eventId: "gy5jc1IU2mN",
                categoryId: "qtYzfVYc50L",
                position: 1,
            },
        ],
    }).get(),
];

const principalDataCreator: ServerDataCreator<CompetitorData, Competitor> = {
    repositoryKey: competitorDIKeys.CompetitorRepository,
    items: () => {
        return entities;
    },
};

const testDataCreator: TestDataCreator<CompetitorData> = {
    givenAValidNewItem: () => {
        return { ...entities[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities[0].toData(),
            id: Id.generateId().value,
            firstName: "",
        };
    },
    givenAValidModifiedItem: (): CompetitorData => {
        return { ...entities[0].toData(), firstName: entities[0].firstName + "modified" };
    },
    givenAInvalidModifiedItem: (): CompetitorData => {
        return { ...entities[0].toData(), firstName: "" };
    },
};

commonCRUDTests(CompetitorsEndpoint, testDataCreator, principalDataCreator);

// Add especific items
