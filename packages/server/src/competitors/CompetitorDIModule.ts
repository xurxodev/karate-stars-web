import { MongoConector } from "../common/data/MongoConector";
import { appDIKeys, di } from "../CompositionRoot";
import UserRepository from "../users/domain/boundaries/UserRepository";
import { CompetitorController } from "./api/CompetitorController";
import CompetitorMongoRepository from "./data/CompetitorMongoRepository";
import CompetitorRepository from "./domain/boundaries/CompetitorRepository";
import { CreateCompetitorUseCase } from "./domain/usecases/CreateCompetitorUseCase";
import { DeleteCompetitorUseCase } from "./domain/usecases/DeleteCompetitorUseCase";
import { GetCompetitorsUseCase } from "./domain/usecases/GetCompetitorsUseCase";
import { GetCompetitorByIdUseCase } from "./domain/usecases/GetCompetitorByIdUseCase";
import { UpdateCompetitorUseCase } from "./domain/usecases/UpdateCompetitorUseCase";
import { categoryDIKeys } from "../categories/CategoryDIModule";
import { countryDIKeys } from "../countries/CountryDIModule";
import { eventDIKeys } from "../events/EventDIModule";
import CategoryRepository from "../categories/domain/boundaries/CategoryRepository";
import CountryRepository from "../countries/domain/boundaries/CountryRepository";
import EventRepository from "../events/domain/boundaries/EventRepository";
import VideoRepository from "../videos/domain/boundaries/VideoRepository";
import { videoDIKeys } from "../videos/VideoDIModule";

export const competitorDIKeys = {
    CompetitorRepository: "CompetitorRepository",
};

export function initializeCompetitors() {
    di.bindLazySingleton(
        competitorDIKeys.CompetitorRepository,
        () => new CompetitorMongoRepository(di.get(MongoConector))
    );

    di.bindLazySingleton(
        GetCompetitorsUseCase,
        () =>
            new GetCompetitorsUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        GetCompetitorByIdUseCase,
        () =>
            new GetCompetitorByIdUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        CreateCompetitorUseCase,
        () =>
            new CreateCompetitorUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<CategoryRepository>(categoryDIKeys.categoryRepository),
                di.get<CountryRepository>(countryDIKeys.countryRepository),
                di.get<EventRepository>(eventDIKeys.eventRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateCompetitorUseCase,
        () =>
            new UpdateCompetitorUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<CategoryRepository>(categoryDIKeys.categoryRepository),
                di.get<CountryRepository>(countryDIKeys.countryRepository),
                di.get<EventRepository>(eventDIKeys.eventRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteCompetitorUseCase,
        () =>
            new DeleteCompetitorUseCase(
                di.get<CompetitorRepository>(competitorDIKeys.CompetitorRepository),
                di.get<VideoRepository>(videoDIKeys.videoRepository),
                di.get<UserRepository>(appDIKeys.userRepository)
            )
    );

    di.bindFactory(
        CompetitorController,
        () =>
            new CompetitorController(
                di.get(appDIKeys.jwtAuthenticator),
                di.get(GetCompetitorsUseCase),
                di.get(GetCompetitorByIdUseCase),
                di.get(CreateCompetitorUseCase),
                di.get(UpdateCompetitorUseCase),
                di.get(DeleteCompetitorUseCase)
            )
    );
}
