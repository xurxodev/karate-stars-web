import { Country, CountryData, Id } from "karate-stars-core";
import { commonCRUDTests } from "../../../common/api/testUtils/crud.spec";
import { CountriesEndpoint } from "../CountryRoutes";
import { countryDIKeys } from "../../CountryDIModule";
import { ServerDataCreator, TestDataCreator } from "../../../common/api/testUtils/DataCreator";

const entities = [
    Country.create({
        id: "ANIgK3ttJDV",
        iso2: "br",
        name: "Brazil",
    }).get(),
    Country.create({
        id: "XzPY9jnM251",
        iso2: "ir",
        name: "Iran",
    }).get(),
];

const principalDataCreator: ServerDataCreator<CountryData, Country> = {
    repositoryKey: countryDIKeys.countryRepository,
    items: () => {
        return entities;
    },
};

const testDataCreator: TestDataCreator<CountryData> = {
    givenAValidNewItem: () => {
        return { ...entities[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...entities[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CountryData => {
        return { ...entities[0].toData(), name: entities[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CountryData => {
        return { ...entities[0].toData(), name: "" };
    },
    givenAItemToDelete: (): CountryData => {
        return entities[0].toData();
    },
};

commonCRUDTests(CountriesEndpoint, testDataCreator, principalDataCreator);

// Add especific items
