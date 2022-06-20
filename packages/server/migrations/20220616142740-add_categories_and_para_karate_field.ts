import { Db } from "mongodb";
import categories from "./data/20220616142740-add_categories_and_para_karate_field.json";

type OldCategory = {
    _id: string;
    name: string;
    typeId: string;
};

type NewCategory = {
    _id: string;
    name: string;
    typeId: string;
    paraKarate: boolean;
    wkfId: string | null;
    new: boolean;
};

export async function up(db: Db) {
    const newCategories: NewCategory[] = categories;
    const collection = db.collection("categories");

    await collection.deleteMany({});

    await Promise.all(
        newCategories.map(cat =>
            collection.updateOne({ _id: cat._id }, { $set: { ...cat } }, { upsert: true })
        )
    );
}

export async function down(db: Db) {
    const newCategories: NewCategory[] = categories;

    const collection = db.collection("categories");

    await collection.deleteMany({});

    const oldCategories: OldCategory[] = newCategories
        .filter(category => !category.new)
        .map(category => {
            return { _id: category._id, name: category.name, typeId: category.typeId };
        });

    await Promise.all(
        oldCategories.map(cat =>
            collection.updateOne({ _id: cat._id }, { $set: { ...cat } }, { upsert: true })
        )
    );
}
