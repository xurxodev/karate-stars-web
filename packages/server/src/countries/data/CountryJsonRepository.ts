import { Country, Either, Id } from "karate-stars-core";
import fetch from "node-fetch";
import { ActionResult } from "../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../common/api/Errors";
import CountryRepository from "../domain/boundaries/CountryRepository";

export default class CountryJsonRepository implements CountryRepository {
    getById(_id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Country>> {
        throw new Error("Method not implemented.");
    }
    delete(_id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        throw new Error("Method not implemented.");
    }
    save(_entity: Country): Promise<Either<UnexpectedError, ActionResult>> {
        throw new Error("Method not implemented.");
    }
    public getAll(): Promise<Country[]> {
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
