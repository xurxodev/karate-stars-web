import fetch from "node-fetch";
import CountryRepository from "../domain/boundaries/CountryRepository";
import { Country } from "../domain/entities/Country";

export default class CountryJsonRepository implements CountryRepository {
    public get(): Promise<Country[]> {
        return new Promise((resolve, reject) => {
            this.getCountries()
                .then((countries: any) => {
                    resolve(countries);
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
        });
    }

    private async getCountries(): Promise<Country[]> {
        const response = await fetch("http://www.karatestarsapp.com/api/v1/countries.json");

        return await response.json();
    }
}
