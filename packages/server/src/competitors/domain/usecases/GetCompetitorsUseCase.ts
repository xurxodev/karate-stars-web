import CompetitorRepository from "../boundaries/CompetitorRepository";
import { Competitor } from "../entities/Competitor";

export default class GetCompetitorsUseCase {
    private repository: CompetitorRepository;

    constructor(resository: CompetitorRepository) {
        this.repository = resository;
    }

    public execute(): Promise<Competitor[]> {
        return this.repository.get();
    }
}
