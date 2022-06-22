import { Db } from "mongodb";
import rankingsData from "./data/20220621143647-create-ranking.json";

type Ranking = {
    _id: string;
    name: string;
    webUrl: string | null;
    apiUrl: string | null;
    categoryParameter: string | null;
    categories: string[];
};

export async function up(db: Db) {
    const rankings: Ranking[] = rankingsData;
    const collection = db.collection("rankings");

    await Promise.all(
        rankings.map(ranking =>
            collection.updateOne({ _id: ranking._id }, { $set: { ...ranking } }, { upsert: true })
        )
    );
}

export async function down(db: Db) {
    const collection = db.collection("rankings");

    await collection.drop();
}
