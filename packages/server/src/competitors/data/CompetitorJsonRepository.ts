import { Competitor, Id, Either } from "karate-stars-core";
import fetch from "node-fetch";
import Parser from "rss-parser";
import { ActionResult } from "../../common/api/ActionResult";
import { ResourceNotFoundError, UnexpectedError } from "../../common/api/Errors";
import CompetitorRepository from "../domain/boundaries/CompetitorRepository";

export default class CompetitorJsonRepository implements CompetitorRepository {
    getById(_id: Id): Promise<Either<ResourceNotFoundError | UnexpectedError, Competitor>> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Competitor[]> {
        throw new Error("Method not implemented.");
    }
    delete(_id: Id): Promise<Either<UnexpectedError, ActionResult>> {
        throw new Error("Method not implemented.");
    }
    save(_entity: Competitor): Promise<Either<UnexpectedError, ActionResult>> {
        throw new Error("Method not implemented.");
    }
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
