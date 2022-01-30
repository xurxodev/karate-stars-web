import { EventTypeRepository } from "../domain/Boundaries";
import { EventTypeData, EventType } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class EventTypeApiRepository
    extends ApiRepository<EventType, EventTypeData>
    implements EventTypeRepository
{
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "event-types");
    }

    protected mapToDomain(data: EventTypeData): EventType {
        return EventType.create(data).get();
    }
}

export default EventTypeApiRepository;
