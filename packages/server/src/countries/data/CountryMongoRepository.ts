import { Country, CountryData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import CountryRepository from "../domain/boundaries/CountryRepository";

type CountryDB = Omit<CountryData, "id"> & MongoCollection;

export default class CountryMongoRepository
    extends MongoRepository<Country, CountryDB>
    implements CountryRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "countries");
    }

    protected mapToDomain(modelDB: CountryDB): Country {
        return Country.create({
            id: modelDB._id,
            name: modelDB.name,
            iso2: modelDB.iso2,
            image: modelDB.image,
        }).get();
    }

    protected mapToDB(entity: Country): CountryDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as CountryDB;
    }
}
