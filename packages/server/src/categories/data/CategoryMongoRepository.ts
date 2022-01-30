import { Category, CategoryData } from "karate-stars-core";
import { MongoConector } from "../../common/data/MongoConector";
import { MongoCollection } from "../../common/data/Types";
import MongoRepository from "../../common/data/MongoRepository";
import { renameProp } from "../../common/data/utils";
import CategoryRepository from "../domain/boundaries/CategoryRepository";

type CategoryDB = Omit<CategoryData, "id"> & MongoCollection;

export default class CategoryTypeMongoRepository
    extends MongoRepository<Category, CategoryDB>
    implements CategoryRepository
{
    constructor(mongoConector: MongoConector) {
        super(mongoConector, "categories");
    }

    async getAll(): Promise<Category[]> {
        const categories = await super.getAll();

        const orderedCategories = categories.sort((a, b) => {
            if (a.name > b.name) {
                return -1;
            }
            if (a.name < b.name) {
                return 1;
            }
            // a must be equal to b
            return 0;
        });

        return orderedCategories;
    }

    protected mapToDomain(modelDB: CategoryDB): Category {
        return Category.create({
            id: modelDB._id,
            name: modelDB.name,
            typeId: modelDB.typeId,
        }).get();
    }

    protected mapToDB(entity: Category): CategoryDB {
        const rawData = entity.toData();

        return renameProp("id", "_id", rawData) as CategoryDB;
    }
}
