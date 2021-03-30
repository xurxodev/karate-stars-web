import { Competitor } from "karate-stars-core";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export default class GetCompetitorsUseCase {
    private repository: CompetitorRepository;

    constructor(resository: CompetitorRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Competitor[]> {
        return this.repository.getAll();
    }
}
