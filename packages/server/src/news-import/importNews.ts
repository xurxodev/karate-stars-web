import { newsImporterFactory } from "./newsImporterFactory";

export interface NewsImporter {
    execute(): Promise<void>;
}

async function execute() {
    const strategies = process.env.IMPORT_NEWS_STRATEGY?.split(",") ?? [];

    const importers = newsImporterFactory.createStrategies(strategies);

    for (const importer of importers) {
        await importer.execute();
    }

    console.log("Import news finished successfully!!");
    process.exit();
}

execute();
