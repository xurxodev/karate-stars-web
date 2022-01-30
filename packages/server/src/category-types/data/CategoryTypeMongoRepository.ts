import { CategoryType, CategoryTypeData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import CategoryTypeRepository from "../domain/boundaries/CategoryTypeRepository";

type CategoryTypeDB = Omit<CategoryTypeData, "id"> & MongoCollection;

export default class CategoryTypeMongoRepository
    extends MongoRepository<CategoryType, CategoryTypeDB>
    implements CategoryTypeRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "categoryTypes");
    }

    protected mapToDomain(modelDB: CategoryTypeDB): CategoryType {
        return CategoryType.create({
            id: modelDB._id,
            name: modelDB.name,
        }).get();
    }

    protected mapToDB(entity: CategoryType): CategoryTypeDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as CategoryTypeDB;
    }
}
