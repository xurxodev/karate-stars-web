import { EventRepository } from "../domain/Boundaries";
import { EventData, Event } from "karate-stars-core";
import ApiRepository from "../../common/data/ApiRepository";
import { AxiosInstance } from "axios";
import { TokenStorage } from "../../common/data/TokenLocalStorage";

class EventApiRepository extends ApiRepository<Event, EventData> implements EventRepository {
    constructor(axiosInstance: AxiosInstance, tokenStorage: TokenStorage) {
        super(axiosInstance, tokenStorage, "events");
    }

    protected mapToDomain(data: EventData): Event {
        return Event.create(data).get();
    }
}

export default EventApiRepository;
