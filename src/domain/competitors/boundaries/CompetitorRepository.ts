import { Competitor } from "../entities/Competitor";

export default interface CompetitorRepository {
    get(): Promise<Competitor[]>;
}
