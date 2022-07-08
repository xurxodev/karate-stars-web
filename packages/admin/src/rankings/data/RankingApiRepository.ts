import { RankingRepository } from "../domain/Boundaries";
import { Ranking, RankingData } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class RankingApiRepository
    extends ApiRepository<Ranking, RankingData>
    implements RankingRepository
{
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "rankings");
    }

    protected mapToDomain(data: RankingData): Ranking {
        return Ranking.create(data).get();
    }
}

export default RankingApiRepository;
