import { CompetitorRepository } from "../domain/Boundaries";
import { Competitor, CompetitorData, Either, Id } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { DataError } from "../../common/domain/Errors";

class CompetitorApiRepository
    extends ApiRepository<CompetitorData>
    implements CompetitorRepository {
    endpoint = `/competitors`;

    async getAll(): Promise<Either<DataError, Competitor[]>> {
        const apiResponse = await super.getMany(this.endpoint);

        return apiResponse.map(data => data.map(item => Competitor.create(item).get()));
    }

    async getById(id: Id): Promise<Either<DataError, Competitor>> {
        const apiResponse = await super.getOne(`${this.endpoint}/${id.value}`);

        return apiResponse.map(item => Competitor.create(item).get());
    }

    async deleteById(id: Id): Promise<Either<DataError, true>> {
        return super.delete(`${this.endpoint}/${id.value}`);
    }

    async save(competitor: Competitor): Promise<Either<DataError, true>> {
        return super.postOrPut(this.endpoint, competitor.id.value, competitor.toData());
    }

    async saveImage(competitorId: Id, file: File): Promise<Either<DataError, true>> {
        return super.putImage(this.endpoint, competitorId.value, file);
    }
}

export default CompetitorApiRepository;
