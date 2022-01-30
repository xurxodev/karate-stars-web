import { CompetitorRepository } from "../domain/Boundaries";
import { Competitor, CompetitorData } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class CompetitorApiRepository
    extends ApiRepository<Competitor, CompetitorData>
    implements CompetitorRepository
{
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "competitors");
    }

    protected mapToDomain(data: CompetitorData): Competitor {
        return Competitor.create(data).get();
    }
}

export default CompetitorApiRepository;
