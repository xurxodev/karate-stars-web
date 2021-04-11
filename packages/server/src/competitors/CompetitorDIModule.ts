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
                di.get(competitorDIKeys.CompetitorRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        CreateCompetitorUseCase,
        () =>
            new CreateCompetitorUseCase(
                di.get(competitorDIKeys.CompetitorRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        UpdateCompetitorUseCase,
        () =>
            new UpdateCompetitorUseCase(
                di.get(competitorDIKeys.CompetitorRepository),
                di.get(appDIKeys.userRepository)
            )
    );

    di.bindLazySingleton(
        DeleteCompetitorUseCase,
        () =>
            new DeleteCompetitorUseCase(
                di.get(competitorDIKeys.CompetitorRepository),
                di.get(appDIKeys.userRepository)
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
