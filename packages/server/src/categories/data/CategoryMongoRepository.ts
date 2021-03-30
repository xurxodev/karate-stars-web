import { Category, CategoryRawData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import CategoryRepository from "../domain/boundaries/CategoryRepository";

type CategoryDB = Omit<CategoryRawData, "id"> & MongoCollection;

export default class CategoryTypeMongoRepository
    extends MongoRepository<Category, CategoryDB>
    implements CategoryRepository {
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "categoryTypes");
    }

    protected mapToDomain(modelDB: CategoryDB): Category {
        return Category.create({
            id: modelDB._id,
            name: modelDB.name,
            typeId: modelDB.typeId,
        }).get();
    }

    protected mapToDB(entity: Category): CategoryDB {
        const rawData = entity.toRawData();

        return renameProp("id", "_id", rawData) as CategoryDB;
    }
}
