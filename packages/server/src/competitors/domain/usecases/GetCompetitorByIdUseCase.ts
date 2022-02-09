import { Either, CompetitorData, Competitor, Event } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import EventRepository from "../../../events/domain/boundaries/EventRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export interface GetCompetitorByIdArg {
    id: string;
}

type GetCompetitorByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCompetitorByIdUseCase {
    constructor(
        private competitorRepository: CompetitorRepository,
        private eventsRepository: EventRepository
    ) {}

    public async execute({
        id,
    }: GetCompetitorByIdArg): Promise<Either<GetCompetitorByIdError, CompetitorData>> {
        const events = await this.eventsRepository.getAll();

        const result = await createIdOrResourceNotFound<GetCompetitorByIdError>(id)
            .flatMap(id => this.competitorRepository.getById(id))
            .map(entity => this.toData(entity, events))
            .run();

        return result;
    }

    private toData(entity: Competitor, events: Event[]): CompetitorData {
        const data = entity.toData();

        return {
            ...data,
            achievements: data.achievements.sort((a, b) => {
                const yearEventA =
                    events.find(event => event.id.value === a.eventId)?.startDate.getFullYear() ||
                    0;
                const yearEventB =
                    events.find(event => event.id.value === b.eventId)?.startDate.getFullYear() ||
                    0;

                if (yearEventA > yearEventB) {
                    return -1;
                }
                if (yearEventA < yearEventB) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }),
        };
    }
}
