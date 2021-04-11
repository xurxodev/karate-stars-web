import { Country, CountryData, Id } from "karate-stars-core";
import { commonCRUDTests, DataCreator } from "../../../common/api/testUtils/crud.spec";
import { CountriesEndpoint } from "../CountryRoutes";
import { countryDIKeys } from "../../CountryDIModule";

const Categories = [
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

const CountryCreator: DataCreator<CountryData, Country> = {
    givenAInitialItems: () => {
        return Categories;
    },
    givenAValidNewItem: () => {
        return { ...Categories[0].toData(), id: Id.generateId().value };
    },
    givenAInvalidNewItem: () => {
        return {
            ...Categories[0].toData(),
            id: Id.generateId().value,
            name: "",
        };
    },
    givenAValidModifiedItem: (): CountryData => {
        return { ...Categories[0].toData(), name: Categories[0].name + "modified" };
    },
    givenAInvalidModifiedItem: (): CountryData => {
        return { ...Categories[0].toData(), name: "" };
    },
};

commonCRUDTests(CountriesEndpoint, countryDIKeys.countryRepository, CountryCreator);

// Add especific items
