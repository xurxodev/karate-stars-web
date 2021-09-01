import { Either, CompetitorData, Competitor, Event } from "karate-stars-core";
import { ResourceNotFoundError, UnexpectedError } from "../../../common/api/Errors";
import { AdminUseCase, AdminUseCaseArgs } from "../../../common/domain/AdminUseCase";
import { createIdOrResourceNotFound } from "../../../common/domain/utils";
import EventRepository from "../../../events/domain/boundaries/EventRepository";
import UserRepository from "../../../users/domain/boundaries/UserRepository";
import CompetitorRepository from "../boundaries/CompetitorRepository";

export interface GetCompetitorByIdArg extends AdminUseCaseArgs {
    id: string;
}

type GetCompetitorByIdError = ResourceNotFoundError | UnexpectedError;

export class GetCompetitorByIdUseCase extends AdminUseCase<
    GetCompetitorByIdArg,
    GetCompetitorByIdError,
    CompetitorData
> {
    constructor(
        private competitorRepository: CompetitorRepository,
        private eventsRepository: EventRepository,
        userRepository: UserRepository
    ) {
        super(userRepository);
    }

    public async run({
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
                const yearEventA = events.find(event => event.id.value === a.eventId)?.year || 0;
                const yearEventB = events.find(event => event.id.value === b.eventId)?.year || 0;

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
