import fetch from "node-fetch";
import Parser from "rss-parser";
import CompetitorRepository from "../../domain/competitors/boundaries/CompetitorRepository";
import { Competitor } from "../../domain/competitors/entities/Competitor";

export default class CompetitorJsonRepository implements CompetitorRepository {
    public parser = new Parser();

    public get(): Promise<Competitor[]> {
        return new Promise((resolve, reject) => {
            this.getCompetitors()
                .then((competitors: Competitor[]) => resolve(competitors))
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
        });
    }

    private async getCompetitors(): Promise<Competitor[]> {
        const response = await fetch("http://www.karatestarsapp.com/api/v1/competitors.json");

        return await response.json();
    }
}
